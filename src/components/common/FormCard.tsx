const FormCard = () => (
  <div className = "flex flex-col space-y-4">
    <label className = "block">
      <span className = "text-gray-700">{"Default Input"}</span>
      <input
        type = "text"
        className = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        placeholder = "Default Input"
      />
    </label>

    <label className = "block">
      <span className = "text-gray-700">{"Active Input"}</span>
      <input
        type = "text"
        className = "mt-1 block w-full rounded-md border-2 border-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        placeholder = "Active Input"
      />
    </label>

    <label className = "block">
      <span className = "text-gray-500">{"Disabled Input"}</span>
      <input
        type = "text"
        className = "mt-1 block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm cursor-not-allowed"
        placeholder = "Disabled Input"
        disabled
      />
    </label>
  </div>
);

export default FormCard;
