import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL('https://deep-embrace-intelligence.ryankong888.chatgpt.site'),
  title: { default: '深拥智能｜让AI真正成为企业生产力', template: '%s · 深拥智能' },
  description: '深拥智能，企业AI转型与价值落地伙伴。聚焦品牌连锁、专业服务和跨境出海，以业务诊断、AI落地和组织变革，将先进技术转化为可衡量的经营成果。',
  openGraph: { title:'深拥智能｜让AI真正成为企业生产力', description:'企业AI转型与价值落地伙伴', locale:'zh_CN', type:'website' },
  icons: {icon:'/favicon.svg'},
};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="zh-CN"><body>{children}</body></html>}
