import Home from "./pages/Home"
import { useEffect } from "react";
import { supabase } from "./components/SupabaseClient";
import { useDispatch } from "react-redux";
import { importRanking } from "./redux/rankingSlice";
import "../assets/style/style.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      let { data, error } = await supabase
        .from('alltimeRanking')
        .select('*');
      dispatch(importRanking(data));
    }

    fetchData();
  }, [])

  return (
    <div className="App">
      <Home />
    </div>
  )
}

export default App
