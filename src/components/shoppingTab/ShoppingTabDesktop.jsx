import { useAppState, useAppDispatch } from '../../AppState';
import { getProductImageLinks, Button_A } from "../Resuables.jsx";
import { Link } from 'react-router-dom';
import { getShoppingCartProductQuantity } from '../../actions/shoppingCartActions.jsx';
import { updateCartAction } from '../../actions/shoppingCartActions.jsx';

export default function ShoppingTab({ isOpen, onClose, shoppingCartItemDetails }) {
  const { shoppingCartItems } = useAppState();
  
  const { shoppingCartItemsList, totalCost } = shoppingCartItemDetails;  
  const shoppingCartEmpty = shoppingCartItems.length === 0;

  return (
    <>
      {/* Overlay (optional) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 cursor-pointer"
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
         {isOpen && (
            <>
              <div 
                  className="flex justify-between items-center  border-b select-none cursor-pointer"
                  onClick={onClose}   
              >
                <div className="pl-4 text-lg">SHOPPING CART</div>
                <button 
                  className="text-gray-600 hover:text-black cursor-pointer"
                  style={{ fontSize: '32px', marginRight: '12px'}}
                >
                  ✕
                </button>
              </div>
              {/* Content */}
              <div className="p-4 h-[calc(100%-128px)]">
                  {shoppingCartEmpty ? 
                    <div className="text-lg select-none">Your shopping cart is empty.</div> 
                    : 
                    <div>
                      {shoppingCartItemsList.map(product => (
                        <ShoppingCartItemRowDisplay key={product.id} product={product} shoppingCartItems={shoppingCartItems}/>
                      ))} 
                    </div>
                  }
              </div>
              <div className="font-semibold text-hmc-text-b border-t select-none text-lg">
                Total Cost: {totalCost}
              </div>
              <div> 
                  <Button_A button_name="CHECK OUT" link_val="/" button_type="form" /> 
              </div>   
            </> 
          )}
      </div>
    </>
  );
}


function ShoppingCartItemRowDisplay({ product, shoppingCartItems }) { 
  const { heroImgLink } = getProductImageLinks(product);
  const dispatch = useAppDispatch(); 
  const shoppingCartProductQuantity = getShoppingCartProductQuantity({ shoppingCartItems, productId: product.id });
  
    return (
      <div className="p-4 select-none">
      <div className="flex gap-4 items-start">
        <Link to={`/product/${product.id}`} className="flex-shrink-0 w-28 h-28">
        <img
          src={heroImgLink.pathFile}
          alt="Thumbnail"
          className="w-full h-full object-contain border border-[var(--color-hmc-border-b)]"
        />
        </Link>

        <div className="flex-1 flex flex-col justify-between">
        <div >
          <Link
            to={`/product/${product.id}`}
            className="text-sm font-semibold text-hmc-text-b"
            style={{lineHeight: 0.5 }}
          >
          {product.name}
          </Link>

          <div className="text-sm text-hmc-text-c mt-1">
          <div className="flex items-center gap-2 text-base font-bold mt-1">
            <span>{product.price}</span>
            <span className="text-sm font-normal">x</span>
            <input
            type="number"
            value={shoppingCartProductQuantity}
            min="1"
            step="1"
            className="w-16 text-sm border rounded px-1 py-0.5 text-center"
            onChange={(val) => {
              const quantity = parseInt(val.target.value, 10);  
              updateCartAction({ dispatch, product, newQuantity: quantity });
            }}
            />
          </div>
          </div>
        </div>
        </div>
      </div>
      </div>
    );
}