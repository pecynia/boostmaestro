import { incrementStoryViews } from '@/lib/utils/db';
import { Locale } from '@../../../i18n.config';

type ViewCounterProps = {
  slug: string
  locale: Locale
};

const ViewCounter: React.FC<ViewCounterProps> = ({ slug, locale }) => {
  incrementStoryViews(slug, locale)
  return null
}

export default ViewCounter;
