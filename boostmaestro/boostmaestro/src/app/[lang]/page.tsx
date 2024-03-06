import { Locale } from '@/app/../../i18n.config'
import EditorServer from '@/app/[lang]/components/editor/EditorServer'

export default function Home({
  params: { lang }
}: {
  params: { lang: Locale }
}) {

  return (
    <div className='bg-background relative'>
      <div className="relative container mx-auto px-4">
        <EditorServer documentId='home-letter' initialLocale={lang} />
      </div>
    </div>
  )
}
