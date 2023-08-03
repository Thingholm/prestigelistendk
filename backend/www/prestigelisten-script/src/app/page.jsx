"use client";

import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import Dashboard from "./Dashboard";
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5b29ueGJ2Y2NvY2dxa3huanFzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3ODE3NzQ3OSwiZXhwIjoxOTkzNzUzNDc5fQ.j0PjXdEKhckfPJga8GiyyDei3Hh4JRcIKFKNfpgw_yY
async function handleBtnClick(key) {
    let success;
    const supabase = createClient("https://fyoonxbvccocgqkxnjqs.supabase.co", key)
    const { data, error } = await supabase
        .from('alltimeRanking')
        .select('*')

    if (data) {
        success = true;
    } if (error) {
        success = false;
    }

    return {
        success: success,
        supabase: supabase
    };
}

export default function Home() {
    const [resStatus, setResStatus] = useState();
    const [keyInput, setKeyInput] = useState("");
    const [supabase, setSupabase] = useState();

    return (
        <main>
            {!resStatus === true &&
                <div>
                    <input type="text" disabled={resStatus === false} onChange={e => setKeyInput(e.target.value)} style={{ width: "30%" }} placeholder="Indsæt nøgle her og tryk 'Tjek'..." />
                    <button disabled={resStatus === false} onClick={() => {
                        if (keyInput) {
                            handleBtnClick(keyInput).then(res => {
                                if (!res.success) {
                                    setResStatus(false)
                                } else {
                                    setResStatus(true)
                                    setSupabase(res.supabase);
                                }
                            })
                        }
                    }
                    }>Tjek</button>
                </div>
            }
            {resStatus === true &&
                <Dashboard supabase={supabase} />
            }
        </main>
    )
}