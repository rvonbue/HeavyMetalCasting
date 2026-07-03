import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

const MAX_CANVAS = 700; // largest canvas edge in display px

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// Canvas image cropper. Click-drag to select (hold Shift for a square); the area
// outside the selection is darkened. Crop bakes the selection into the working
// image; Expand grows the selection from its center (keeping aspect ratio) until
// it meets a canvas edge. getBlob() returns the edited image, or null if never
// cropped.
const ImageCropper = forwardRef(function ImageCropper({ src }, ref) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const editedRef = useRef(false);
  const scaleRef = useRef(1); // canvas px per image px
  const dragRef = useRef(null);

  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [selection, setSelection] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      editedRef.current = false;
      fitToImage(img);
    };
    img.onerror = () => toast.error("Could not load image for editing");
    img.src = src;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  function fitToImage(img) {
    const scale = Math.min(MAX_CANVAS / img.naturalWidth, MAX_CANVAS / img.naturalHeight, 1);
    scaleRef.current = scale;
    setSelection(null);
    setDims({
      w: Math.round(img.naturalWidth * scale),
      h: Math.round(img.naturalHeight * scale),
    });
  }

  // Redraw whenever the canvas size or selection changes.
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !dims.w) return;

    const ctx = canvas.getContext("2d");
    const { width: w, height: h } = canvas;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);

    if (selection) {
      const s = scaleRef.current;
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, w, h);
      // Punch the selection back through the overlay by redrawing that region.
      ctx.drawImage(
        img,
        selection.x / s, selection.y / s, selection.w / s, selection.h / s,
        selection.x, selection.y, selection.w, selection.h
      );
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.strokeRect(selection.x, selection.y, selection.w, selection.h);
    }
  }, [dims, selection]);

  function pointerPos(e) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function onPointerDown(e) {
    const canvas = canvasRef.current;
    canvas.setPointerCapture(e.pointerId);
    const p = pointerPos(e);
    dragRef.current = { startX: p.x, startY: p.y };
    setSelection(null); // starting a new drag clears the old selection
  }

  function onPointerMove(e) {
    if (!dragRef.current) return;
    const canvas = canvasRef.current;
    const { startX, startY } = dragRef.current;
    const p = pointerPos(e);

    let dx = p.x - startX;
    let dy = p.y - startY;

    if (e.shiftKey) {
      const m = Math.max(Math.abs(dx), Math.abs(dy));
      dx = (Math.sign(dx) || 1) * m;
      dy = (Math.sign(dy) || 1) * m;
    }

    let x = startX;
    let y = startY;
    let w = dx;
    let h = dy;
    if (w < 0) { x += w; w = -w; }
    if (h < 0) { y += h; h = -h; }

    x = clamp(x, 0, canvas.width);
    y = clamp(y, 0, canvas.height);
    w = clamp(w, 0, canvas.width - x);
    h = clamp(h, 0, canvas.height - y);

    setSelection({ x, y, w, h });
  }

  function onPointerUp() {
    dragRef.current = null;
    setSelection((sel) => (sel && sel.w >= 3 && sel.h >= 3 ? sel : null));
  }

  function handleCrop() {
    const img = imgRef.current;
    if (!selection || !img) return;
    const s = scaleRef.current;
    const sw = Math.round(selection.w / s);
    const sh = Math.round(selection.h / s);
    if (sw < 1 || sh < 1) return;

    const off = document.createElement("canvas");
    off.width = sw;
    off.height = sh;
    off.getContext("2d").drawImage(
      img,
      selection.x / s, selection.y / s, selection.w / s, selection.h / s,
      0, 0, sw, sh
    );

    let dataUrl;
    try {
      dataUrl = off.toDataURL("image/webp", 0.92);
    } catch {
      toast.error("Can't crop — image blocked by cross-origin policy");
      return;
    }

    const next = new Image();
    next.onload = () => {
      imgRef.current = next;
      editedRef.current = true;
      fitToImage(next);
    };
    next.src = dataUrl;
  }

  // Grow the selection from its center, keeping aspect ratio, until it reaches a
  // canvas edge (largest centered crop of that ratio).
  function handleExpand() {
    const canvas = canvasRef.current;
    if (!selection || !canvas) return;
    const cx = selection.x + selection.w / 2;
    const cy = selection.y + selection.h / 2;
    const halfW = selection.w / 2;
    const halfH = selection.h / 2;
    if (halfW < 1 || halfH < 1) return;

    const f = Math.min(
      Math.min(cx, canvas.width - cx) / halfW,
      Math.min(cy, canvas.height - cy) / halfH
    );
    const nw = selection.w * f;
    const nh = selection.h * f;
    setSelection({ x: cx - nw / 2, y: cy - nh / 2, w: nw, h: nh });
  }

  useImperativeHandle(ref, () => ({
    hasEdits: () => editedRef.current,
    getBlob: () =>
      new Promise((resolve) => {
        const img = imgRef.current;
        if (!editedRef.current || !img) {
          resolve(null);
          return;
        }
        const off = document.createElement("canvas");
        off.width = img.naturalWidth;
        off.height = img.naturalHeight;
        off.getContext("2d").drawImage(img, 0, 0);
        off.toBlob((blob) => resolve(blob), "image/webp", 0.92);
      }),
  }));

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas
        ref={canvasRef}
        width={dims.w}
        height={dims.h}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="max-w-full touch-none cursor-crosshair select-none"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCrop}
          disabled={!selection}
          className="px-4 py-2 text-sm bg-hmc-button-a text-hmc-button-text-a font-bold hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Crop
        </button>
        <button
          type="button"
          onClick={handleExpand}
          disabled={!selection}
          className="px-4 py-2 text-sm border border-hmc-border-a text-hmc-textprimary hover:bg-hmc-button-a/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Expand to edges
        </button>
      </div>
    </div>
  );
});

export default ImageCropper;
