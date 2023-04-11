import AlltimeRanking from "@/app/AlltimeRanking"
import '../style/style.css'
import RankingLinkHeader from "@/components/RankingLinkHeader"
import RankingMovements from "./RankingMovements"
import ActiveRanking from "./ActivevRanking"

export default function Home() {
  return (
    <div>
      <div className="hero-section">
        <div className="hero-text-container">
          <p className="hero-text-quote">"Cycling isn't a game, it's a sport. Tough, hard and unpitying, and it requires great sacrifices. One plays football, or tennis, or hockey. One doesn't play at cycling."</p>
          <p className="hero-text-quote-byline">- Jean De Gribaldy</p>
          <p>Velkommen til Mathias Jensens og Mathias Mundbjergs bud på en prestigeliste i landevejscyklingens verden.</p>
          <p>Prestigelistens formål er dels at fungere som opslagsværk for cykelhistoriens vigtigste resultater, og dels at give mulighed for at sammenligne ryttere over tid. Vi har forsøgt at udfærdige pointgivningen således, at hverken de nutidige eller de ældste ryttere favoriseres i for høj grad. Vi har forsøgt at balancere det, således at det, at der var mindre konkurrence for 100 år siden, udligner det mindre antal prestigefyldte løb, hvori det var muligt at score point.</p>
          <p>Opgørelsen omfatter data helt tilbage til den første udgave af Milano-Torino i 1876, hvilket vil sige i alt mere end 30.000 placeringer fordelt på de mere end 4.300 forskellige ryttere, der har opnået mindst et af de 757 pointgivende resultater.</p>
        </div>
        <div className="hero-ranking-container">
          <RankingLinkHeader title="All time største ryttere" link="#" />
          <AlltimeRanking />
        </div>
      </div>

      <div className="landing-movements-section">
        <RankingLinkHeader title="Seneste bevægelser" link="#" />
        <RankingMovements />
      </div>

      <div className="landing-split-rankings-section">
        <ActiveRanking />
      </div>
    </div>
  )
}