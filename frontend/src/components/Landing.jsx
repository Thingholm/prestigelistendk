import { useEffect, useState } from "react";
import { supabase } from "./SupabaseClient";

function Landing() {
    const [alltimeRanking, setAlltimeRanking] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            let { data, error } = await supabase
                .from('alltimeRanking')
                .select('*');
            setAlltimeRanking(data);
        }

        fetchData();
    }, [])

    return (
        <div className="landing-container">
            <div className="landing-quote-container">
                <h2>"Cycling isn't a game, it's a sport. Tough, hard and unpitying, and it requires great sacrifices. One plays football, or tennis, or hockey. One doesn't play at cycling.</h2>
                <h3>- Jean De Gribaldy</h3>
            </div>
        </div>
    );
}

export default Landing;