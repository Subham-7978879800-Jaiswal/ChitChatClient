import { Spinner } from "@material-tailwind/react";

const Loader = () => {
  return (
    <div
      style={{
        position: "absolute",
        height: "100vh",
        width: "100vw",
        backgroundColor: "white",
        opacity: 0.5,
        top: 0,
        left: 0,
      }}
    >
      <Spinner
        style={{ position: "absolute", top: "50%", left: "50%" }}
        className="h-16 w-16 text-blue-500/10"
      />
    </div>
  );
};

export default Loader;
