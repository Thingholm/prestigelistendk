import Landing from "../components/Landing";
import "../assets/style/style.css";

function Home() {
    return (
        <div className="homepage-wrapper">
            <Landing />
            <div className="home-text">
                <h3>Prolog</h3>
                <p>Velkommen til Mathias Jensens og Mathias Mundbjergs bud på en prestigeliste i landevejscyklingens verden.</p>
                <p>Vi vil gerne begynde med at slå fast, at pointsystemet er baseret på en subjektiv vurdering, men en gennemdiskuteret og - mener vi selv - kvalificeret en af slagsen.</p>
                <p>Prestigelistens formål er dels at fungere som opslagsværk for cykelhistoriens vigtigste resultater, og dels at give mulighed for at sammenligne ryttere over tid. Vi har forsøgt at udfærdige pointgivningen såled, at hverken de nutidige eller de ældste ryttere favoriseres i for høj grad. Vi har forsøgt at balancere det, således at det, at der var mindre konkurrence for 100 år siden, udligner det mindre antal prestigefyldte løb, hvori det var muligt at score point.</p>
                <p>Opgørelsen omfatter data helt tilbage til den første udgave af Milano-Torino i 1876, hvilket vil sige i alt mere end 30.000 placeringer fordelt på de flere end 4.000 forskellige ryttere, der har opnået mindst et af de 757 pointgivende resultater.</p>
            </div>
        </div>
    );
}

export default Home;