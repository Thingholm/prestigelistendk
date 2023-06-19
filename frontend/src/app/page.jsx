import AlltimeRanking from "@/app/AlltimeRanking"
import '../style/style.css'
import RankingLinkHeader from "@/components/RankingLinkHeader"
import RankingMovements from "./RankingMovements"
import ActiveRanking from "./ActiveRanking"
import DanishRanking from "./DanishRanking"
import NationRanking from "./NationRanking"
import ThreeYearRanking from "./ThreeYearRanking"
import ByDecadeRanking from "./ByDecadeRanking"
import GreatestSeasons from "./GreatestSeasons"
import { Suspense } from "react"
import LoadingGreatestSeasons from "./LoadingGreatestSeasons"
import SectionLinkButton from "@/components/SectionLinkButton"
import { baseUrl } from "@/utils/baseUrl"
import Link from "next/link"
import { ImQuotesRight } from "../../node_modules/react-icons/im"

export default function Home() {
  return (
    <div>
      <div className="hero-section">
        <div className="hero-text-container">
          <div className="quote-container">
            <div className="quote-icon-container">
              <ImQuotesRight size={20} />
            </div>
            <p className="hero-text-quote">Cycling isn&#39;t a game, it&#39;s a sport. Tough, hard and unpitying, and it requires great sacrifices. One plays football, or tennis, or hockey. One doesn&#39;t play at cycling.</p>
            <p className="hero-text-quote-byline">- Jean De Gribaldy</p>
          </div>
          <p>Velkommen til Mathias Jensens og Mathias Fisker Mundbjergs bud på en prestigeliste i landevejscyklingens verden.</p>
          <p>Vi vil gerne begynde med at slå fast, at pointsystemet er baseret på en subjektiv vurdering, men en gennemdiskuteret og - mener vi selv - kvalificeret en af slagsen.</p>
          <p>Prestigelistens primære formål er at give mulighed for at sammenligne ryttere over tid. Vi har forsøgt at udfærdige pointgivningen, så hverken de nutidige eller de ældste ryttere favoriseres i for høj grad. Vi har forsøgt at balancere det, så det, at der var mindre konkurrence for 100 år siden, udligner det mindre antal prestigefyldte løb, hvori det var muligt at score point.</p>
          <div className="btn-container">
            <Link href="/listen">Udforsk Prestigelisten</Link>
            <Link href="/om-prestigelisten">Mere om listen...</Link>
          </div>
          <div className="scroll-indicator-icon"></div>
        </div>
        <div className="hero-ranking-container">
          <RankingLinkHeader title="All time største ryttere" link="/listen" />
          <AlltimeRanking />
        </div>
      </div>

      <div className="landing-movements-section" id="seneste-resultater">
        <h3>Seneste pointgivende resultater <SectionLinkButton link={baseUrl + "/#seneste-resultater"} sectionName={"Pointgivende resultater seneste måned"} /></h3>
        <RankingMovements />
      </div>

      <div className="landing-split-rankings-section">
        <div className="active-ranking-table-container split-ranking-table">
          <RankingLinkHeader title="Største aktive ryttere" link={"listen?activeStatus=active"} mode="light" sectionLink={<SectionLinkButton link={baseUrl + "/#stoerste-aktive"} sectionName={"Største aktive ryttere"} bg={"dark"} />} />
          <ActiveRanking />
        </div>

        <div className="danish-ranking-table-container split-ranking-table">
          <RankingLinkHeader title="Største danske ryttere" link={"listen?nation=Danmark"} mode="light" sectionLink={<SectionLinkButton link={baseUrl + "/#stoerste-danskere"} sectionName={"Største danskere"} bg={"dark"} />} />
          <DanishRanking />
        </div>
      </div>

      <NationRanking />

      <Suspense fallback={<LoadingGreatestSeasons />}>
        <GreatestSeasons />
      </Suspense>

      <ThreeYearRanking />

      <ByDecadeRanking />
    </div>
  )
}