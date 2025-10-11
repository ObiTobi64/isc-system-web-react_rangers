const SessionActive = () => (
  <div className = "flex items-center justify-center h-screen bg-gray-100">
    <div className = "p-6 bg-white shadow rounded text-center">
      <h2 className = "text-xl font-bold mb-4">{"Sesión activa"}</h2>
      <p>
        {"Ya existe una sesión iniciada en otra pestaña.\r"}
        <br />
        {"Por favor ciérrala antes de continuar.\r"}
      </p>
    </div>
  </div>
);

export default SessionActive;
