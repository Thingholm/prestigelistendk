import List from "@/components/List"
import { supabase } from "@/utils/supabase"

export default function Home({ data }) {
  console.log({ data })

  return (
    <main>
      <div>
        <List />
      </div>
    </main>
  )
}

export async function getServerSideProps(context) {
  let data = await supabase.from('alltimeRanking').select('*')

  return {
    props: {
      data,
    }
  }
}