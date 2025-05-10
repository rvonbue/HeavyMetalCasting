import { Link } from "react-router-dom";

export function Button_A({button_name, link_val, button_type, button_styles_outer }) {
  return (
    <>      
      {button_type === "form" ? 
        <div className="text-hmc-a hover:text-hmc-b bg-hmc-button-a hover:bg-hmc-button-b hover:text-avocado-600 px-5 py-2 rounded transition font-bold"
          style={button_styles_outer}
        >
          <button 
            type="submit"
            style={ { color: "inherit", backgroundColor: "inherit",}}
          >
            {button_name}
          </button> 
        </div>
        :
        <div className="text-hmc-a hover:text-hmc-b font-bold">
        <Link
          to={link_val}
          className="bg-hmc-button-a hover:bg-hmc-button-b hover:text-avocado-600 px-5 py-2 rounded transition font-bold"
          style={{ color: "inherit" }}
        >
          {button_name}
        </Link>
        </div>
      }
    </>

  )
}


export function FolderTab({ label, selected, onClick }) {
  return (
    <div
      className={`relative inline-block cursor-pointer mr-12 top-2 z-[${
        selected ? 30 : 20
      }]`}
      onClick={onClick}
    >
      {/* Left Skew */}
      <div
        className={`absolute left-[-20px] top-0 h-10 w-8 z-[-1] rounded-t-md transform -skew-x-[20deg] ${
          selected ? 'bg-hmc-button-b' : 'bg-hmc-button-a'
        }`}
      />
      {/* Right Skew */}
      <div
        className={`absolute right-[-20px] top-0 h-10 w-8 z-[-1] rounded-t-md transform skew-x-[20deg] ${
          selected ? 'bg-hmc-button-b' : 'bg-hmc-button-a'
        }`}
      />
      {/* Main Tab */}
      <div
        className={`h-10 px-4 flex items-center rounded-t-md z-[1] relative ${
          selected
            ? 'bg-hmc-button-b text-hmc-button-text-b font-semibold'
            : 'bg-hmc-button-a text-hmc-button-text-a'
        }`}
      >
        {label}
      </div>
    </div>
  );
}