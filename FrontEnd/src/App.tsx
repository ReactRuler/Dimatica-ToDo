import Logo from "./components/Logo";
import MainList from "./components/ListComponents/List";

function App() {
  return (
    <>
      <div className="w-screen h-screen flex flex-col justify-start items-center md:p-10">
        <Logo />
        <h1 className="text-3xl font-bold">Hello world!</h1>
        <div className="w-[90%] max-w-[90%] md:max-w-none  items-center justify-center flex md:w-[90%]">
          <MainList />
        </div>
      </div>
    </>
  );
}

export default App;
