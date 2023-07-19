import SectionLinkButton from "@/components/SectionLinkButton";
import { baseUrl } from "@/utils/baseUrl";
import Link from "next/link";

export const metadata = {
    title: 'Om Prestigelisten',
    description: 'Hvad er Prestigelisten, og hvem står bag?',
}

export default function AboutPage() {
    return (
        <div className="about-page">
            <h2>Om Prestigelisten <SectionLinkButton link={baseUrl + "/om-prestigelisten"} sectionName={"Om Prestigelisten"} /></h2>
            <p>Velkommen til Mathias Jensens og Mathias Fisker Mundbjergs bud på en prestigeliste i landevejscyklingens verden.</p>
            <p>Vi vil gerne begynde med at slå fast, at pointsystemet er baseret på en subjektiv vurdering, men en gennemdiskuteret og - mener vi selv - kvalificeret en af slagsen.</p>
            <p>Prestigelistens primære formål er at give mulighed for at sammenligne ryttere over tid. Vi har forsøgt at udfærdige pointgivningen, så hverken de nutidige eller de ældste ryttere favoriseres i for høj grad. Vi har forsøgt at balancere det, så det, at der var mindre konkurrence for 100 år siden, udligner det mindre antal prestigefyldte løb, hvori det var muligt at score point.</p>
            <p>Opgørelsen omfatter data helt tilbage til den første udgave af Milano-Torino i 1876, hvilket vil sige i alt mere end 30.000 placeringer fordelt på de flere end 4.000 forskellige ryttere, der har opnået mindst et af de 754 pointgivende resultater.</p>
            <p>Der er ni forskellige ranglister:</p>
            <ul>
                <li><Link href="/listen" target="_blank"> En all time-rangering, som lister de ryttere, som gennem tiderne har opnået de mest prestigefyldte resultater</Link></li>
                <li><Link href="/listen?activeStatus=active" target="_blank">En rangering af de fortsat aktive ryttere, som har opnået de mest prestigefyldte resultate</Link></li>
                <li><Link href="/nationer" target="_blank"> En rangering af de nationer, hvis ryttere gennem tiden har optjent flest point</Link></li>
                <li><Link href="/listen?nation=Danmark" target="_blank">En rangering af de største danskere, som har opnået point</Link></li>
                <li><a href="/#3-aarig-rullende" target="_blank">En tre-årig rullende oversigt over de ryttere, der har optjent flest point over de seneste tre sæsoner - dog på et meget begrænset grundlag før år 1900</a></li>
                <li><a href="#stoerste-alltime-hvert-aar" target="_blank">En oversigt over top 10 all time, som den har set ud hvert år gennem tiden - dog på et meget begrænset grundlag før år 1900</a></li>
                <li><a href="/#stoerste-per-aarti" target="_blank">En oversigt over, hvilke ryttere der har optjent flest point i hvert årti - dog på et meget begrænset grundlag før 1900</a></li>
                <li><a href="/#stoerste-saesoner" target="_blank">En rangering af de sæsoner, hvori en enkelt rytter har opnået de mest prestigefyldte resultater</a></li>
                <li><Link href="/listen?yearFilterRange=single" target="_blank">En rangering af de største ryttere fra hver årgang</Link></li>
            </ul>
            <p>Løbsresultaterne beror hovedsageligt på ProCyclingStats&#39; og CyclingRankings databaser. Alle ryttere er skrevet uden eventuel omlyd eller specialtegn for at undgå fejl, hvor rytterne ikke får godskrevet deres point.</p>
            <p>Pointsystemet er primært baseret på egne vurderinger, men vi har - hovedsageligt ved de ældre resultater - støttet os til CyclingRankings opgørelser, som blandt andet lægger vægt på, hvor stærkt løbene har været besat.</p>
            <p>Bemærk, at listen er blevet til ud fra den præmis, at løbene afgøres på cyklen, da det er her, størstedelen af prestigen opnås. Derfor afspejler resultaterne ikke eventuelle dopingdomme, der er kommet på bagkant af selve cykelløbene. Vi har markeret resultater, som officielt er ændret som følge af doping, med sort baggrund i resultatarket, som du finder under rådata.</p>
            <p>Hvis du finder fejl i resultaterne eller på hjemmesiden, har kendskab til yderligere udgaver af de oplistede løb, vil kommentere pointgivningen eller give anden form for feedback, hører vi meget gerne fra dig på <Link href="mailto:prestigelisten@hotmail.com" target="_blank">prestigelisten@hotmail.com</Link>. Arkenes udvikling kan følges på Twitter-profilen <Link href="https://twitter.com/prestigelisten" target="_blank">@prestigelisten</Link>, som vi også kan kontaktes gennem med en direkte besked.</p>
            <p>God fornøjelse!</p>
            <p>Mathias og Mathias</p>
        </div>
    )
}