"use client";

import Image from "next/image";
import { useState } from "react";

export default function RiderImage(props) {
    const rider = props.riderInfo;
    const [imgSrc, setImgSrc] = useState("https://fyoonxbvccocgqkxnjqs.supabase.co/storage/v1/object/public/riderPortraits/" + rider.fullName.replace(/ /g, "").toLowerCase().replace(/ø/g, "oe").replace(/å/g, "aa").replace(/æ/g, "ae") + ".jpg");

    return (
        <Image
            loader={() => imgSrc}
            src={imgSrc}
            onError={() => setImgSrc("https://fyoonxbvccocgqkxnjqs.supabase.co/storage/v1/object/public/riderPortraits/nopicture.png")}
            height={200}
            width={200}
            quality={100}
            alt={"Billede af " + rider.fullName.replace(" ", "").toLowerCase()}
        />
    )
}