import { Provider } from "react-redux";
import store from "./redux/store";
import ControllGame from "./components/ControllGame";
import GameArea from "./components/GameArea";

export default function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen items-center justify-center bg-muted max-w-[1000px] mx-auto border-2 p-10">
        <ControllGame></ControllGame>
        <GameArea></GameArea>
      </div>
    </Provider>
  );
}
