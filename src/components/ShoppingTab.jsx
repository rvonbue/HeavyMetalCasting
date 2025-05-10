import { useAppState, useAppDispatch } from '../AppState';

export default function ShoppingTab({ isOpen, onClose }) {
  const { shoppingCartItems } = useAppState();
  const shoppingCartEmpty = shoppingCartItems.length === 0;

  return (
    <>
      {/* Overlay (optional) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          style={{opacity: 0.25}}
          onClick={onClose}
        />
      )}

      {/* Sliding panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-between items-center  border-b select-none">
          <div className="pl-4">
            SHOPPING CART
          </div>
          <button 
            className="text-gray-600 hover:text-black"
            style={{ fontSize: '32px', marginRight: '12px'}}
            onClick={onClose} 
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
            {shoppingCartEmpty ? 
              <div className="text-lg">Your shopping cart is empty.</div> 
              : 
              <div></div>
            }
        </div>
      </div>
    </>
  );
}