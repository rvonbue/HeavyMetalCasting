export const CartIcon = ({ stroke = "#000", size = 36 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Cart basket */}
    <path d="M6 6h15l-1.5 8.5a2 2 0 0 1-2 1.5H8a2 2 0 0 1-2-1.5L4.5 3H2" />

    {/* Handle */}
    <line x1="6" y1="6" x2="4" y2="3" />

    {/* Wheels */}
    <circle cx="9" cy="20" r="1.5" />
    <circle cx="17" cy="20" r="1.5" />

    {/* Inner skeleton bars */}
    <line x1="10" y1="8" x2="10" y2="14" />
    <line x1="14" y1="8" x2="14" y2="14" />
  </svg>
);

const classTextLightDarkHover = "fill-current text-hmc-button-text-b hover:text-hmc-button-text-a transition-colors duration-200";
const defualtIconStyles = {cursor: "pointer", pointerEvents: "all" };

export const PencilIcon = ({ classes, styles }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    aria-hidden="true"
    focusable="false"
    width="24"
    height="24"
    className={ classes ? classTextLightDarkHover + " " +  classes : classTextLightDarkHover }
    style={{...defualtIconStyles, ...styles}}
  >
    <path d="M395.8 39.6c9.4-9.4 24.6-9.4 33.9 0l42.6 42.6c9.4 9.4 9.4 24.6 0 33.9L417.6 171 341 94.4l54.8-54.8zM318.4 117L395 193.6l-219 219 0-12.6c0-8.8-7.2-16-16-16l-32 0 0-32c0-8.8-7.2-16-16-16l-12.6 0 219-219zM66.9 379.5c1.2-4 2.7-7.9 4.7-11.5L96 368l0 32c0 8.8 7.2 16 16 16l32 0 0 24.4c-3.7 1.9-7.5 3.5-11.6 4.7L39.6 472.4l27.3-92.8zM452.4 17c-21.9-21.9-57.3-21.9-79.2 0L60.4 329.7c-11.4 11.4-19.7 25.4-24.2 40.8L.7 491.5c-1.7 5.6-.1 11.7 4 15.8s10.2 5.7 15.8 4l121-35.6c15.4-4.5 29.4-12.9 40.8-24.2L495 138.8c21.9-21.9 21.9-57.3 0-79.2L452.4 17zM331.3 202.7c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0l-128 128c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0l128-128z"/>
  </svg>
);
export const TrashIcon = ({ classes, styles }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    aria-hidden="true"
    focusable="false"
    width="24"
    height="24"
    className={ classes ? classTextLightDarkHover + " " + classes : classTextLightDarkHover }
    style={{...defualtIconStyles, ...styles}}
  >
    <path d="M164.2 39.5L148.9 64l150.3 0L283.8 39.5c-2.9-4.7-8.1-7.5-13.6-7.5l-92.5 0c-5.5 0-10.6 2.8-13.6 7.5zM311 22.6L336.9 64 384 64l32 0 16 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-16 0 0 336c0 44.2-35.8 80-80 80l-224 0c-44.2 0-80-35.8-80-80L32 96 16 96C7.2 96 0 88.8 0 80s7.2-16 16-16l16 0 32 0 47.1 0L137 22.6C145.8 8.5 161.2 0 177.7 0l92.5 0c16.6 0 31.9 8.5 40.7 22.6zM64 96l0 336c0 26.5 21.5 48 48 48l224 0c26.5 0 48-21.5 48-48l0-336L64 96zm80 80l0 224c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-224c0-8.8 7.2-16 16-16s16 7.2 16 16zm96 0l0 224c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-224c0-8.8 7.2-16 16-16s16 7.2 16 16zm96 0l0 224c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-224c0-8.8 7.2-16 16-16s16 7.2 16 16z"/>
  </svg>
);
export const TailwindSpinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};
export const ArrowDownIcon = ({ classNames }) => {
  return (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-4 ${classNames ? classNames : ""}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
  </svg>
  );
};
export const ArrowUpIcon = ({ classNames }) => {
  return (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-4 ${classNames ? classNames : ""}`}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
</svg>

  );
};
import SkullSVG from '../assets/icons/skull.svg';

export const SkullIcon = ({
  size = 36,
  ...props
}) => (
  <img
    src={SkullSVG}
    alt="Skull"
    width={size}
    height={size}
    style={{ objectFit: 'contain', ...props.style }}
    {...props}
  />
);

export const DeleteIcon = ({ stroke = "#000", size = 36 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Skeleton casted trash can */}
    <rect x="5" y="6" width="14" height="14" rx="2" ry="2" />
    {/* Open lid */}
    <line x1="3" y1="6" x2="21" y2="6" />
    {/* Inner skeleton bars */}
    <line x1="9" y1="6" x2="9" y2="20" />
    <line x1="15" y1="6" x2="15" y2="20" />
    {/* Lid handle */}
    <line x1="10" y1="3" x2="14" y2="3" />
  </svg>
);
