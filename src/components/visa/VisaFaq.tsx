import FaqAccordion from '../blog/blocks/FaqAccordion';
import type { FAQ } from '../../data/visaFaqs';

export default function VisaFaq({ faqs }: { faqs: FAQ[] }) {
  const items = faqs.map((f) => ({ q: f.question, a: f.answer }));
  return <FaqAccordion items={items} />;
}
