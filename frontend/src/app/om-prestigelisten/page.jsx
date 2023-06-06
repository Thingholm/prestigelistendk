import SectionLinkButton from "@/components/SectionLinkButton";
import { baseUrl } from "@/utils/baseUrl";

export const metadata = {
    title: 'Om Prestigelisten',
    description: 'Hvad er Prestigelisten, og hvem står bag?',
}

export default function AboutPage() {
    return (
        <div className="about-page">
            <h2>Om Prestigelisten <SectionLinkButton link={baseUrl + "/om-prestigelisten"} sectionName={"Om Prestigelisten"} /></h2>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Beatae illum quas unde doloribus eos labore at, maxime nulla officia repudiandae quibusdam fugit vel, quae, commodi dignissimos totam nobis expedita sapiente eveniet? Laboriosam perferendis incidunt sed rerum officia quisquam nesciunt quod?</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum explicabo sint delectus deserunt quaerat quis, modi earum voluptatem consectetur ea maxime in deleniti laudantium obcaecati rem cumque. Accusantium, possimus dolore? Ullam dolore similique, quisquam accusamus ratione deleniti. Pariatur illum nemo veniam vitae repudiandae dicta. Quam quis dolor quaerat illo debitis enim dolores vel repellendus dolorum magni quia quos iusto ipsa ab natus molestiae, ex facilis laborum deserunt id cupiditate sint tenetur. Aspernatur sequi, voluptatem vel maiores eum suscipit quisquam modi?</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident minima cum dicta aut, delectus ipsum error nesciunt odio sint libero perspiciatis consequuntur similique qui debitis facilis a commodi? Illo officiis ab nesciunt. A, quisquam odio.</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias laborum repellendus, molestiae aliquam dolore id provident soluta quaerat suscipit neque error cumque earum deserunt accusamus laboriosam doloremque pariatur ex, ab vitae debitis libero cupiditate totam. Esse debitis incidunt, iusto alias necessitatibus tempora amet consectetur quam rem nam cumque fuga ut deserunt vel explicabo eligendi assumenda? Praesentium laborum ab provident esse odit veniam voluptates ratione sunt!</p>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptates blanditiis perferendis eligendi sunt iste inventore! Cum ea rem nisi quas, illo culpa. Esse quia eaque totam dolor? Ullam tempore animi ratione numquam. Quia, eum. Fuga odio veniam, dolores ratione dolorum consequatur, blanditiis quae quos possimus incidunt cum iure, sed similique.</p>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nisi suscipit placeat debitis aperiam quibusdam atque dignissimos tempore voluptatibus deserunt molestias!</p>
        </div>
    )
}