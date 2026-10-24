import './client-logos.css';

// Keep the 23 supplied logos in their original numbered order and file formats.
const logos = [
  ['中国平安', '01-ping-an.png'],
  ['海尔', '02-haier.png'],
  ['越秀集团', '03-yuexiu.png'],
  ['广汽集团', '04-gac.png'],
  ['中国建设银行', '05-ccb.png'],
  ['深圳报业', '06-shenzhen-press.png'],
  ['长隆集团', '07-chimelong.png'],
  ['润建股份', '08-runjian.png'],
  ['三雄极光', '09-pak.png'],
  ['广东交通集团', '10-guangdong-transport.png'],
  ['浪潮', '11-inspur.png'],
  ['PHILIPS', '12-philips.svg'],
  ['雀巢 Nestlé', '13-nestle.svg'],
  ['BMW', '14-bmw.svg'],
  ['L’ORÉAL', '15-loreal.svg'],
  ['字节跳动', '16-bytedance.png'],
  ['碧桂园', '17-country-garden.jpg'],
  ['Nike', '18-nike.svg'],
  ['百度', '19-baidu.png'],
  ['Mercedes-Benz', '20-mercedes-benz.svg'],
  ['TCL', '21-tcl.webp'],
  ['兰蔻', '22-lancome.png'],
  ['Armani', '23-armani.png'],
] as const;

// Display windows remove only excess blank canvas; source files stay untouched.
const displayWindows: Record<string, {width:number; height:number; viewBox:string}> = {
  '04-gac.png': {width:547, height:365, viewBox:'0 115 547 135'},
  '06-shenzhen-press.png': {width:395, height:215, viewBox:'15 0 323 215'},
  '09-pak.png': {width:628, height:318, viewBox:'31 114 567 102'},
  '11-inspur.png': {width:547, height:365, viewBox:'0 118 547 129'},
  '17-country-garden.jpg': {width:654, height:354, viewBox:'85 25 413 292'},
  '19-baidu.png': {width:3840, height:2160, viewBox:'3 444 3828 1296'},
  '21-tcl.webp': {width:1683, height:1182, viewBox:'447 451 789 279'},
  '22-lancome.png': {width:3840, height:2160, viewBox:'0 561 3840 1038'},
  '23-armani.png': {width:2400, height:2400, viewBox:'7 962 2386 476'},
};

export default function ClientLogos() {
  return <div className="client-proof client-proof-originals">
    <div className="client-proof-heading">
      <h3>团队服务过的企业</h3>
      <p>跨行业的实践积累，让技术更懂业务。</p>
    </div>
    <div className="client-logo-grid">
      {logos.map(([name, file]) => {
        const window = displayWindows[file];
        return <div className="client-logo" key={file} title={name}>
          {window ? <svg viewBox={window.viewBox} preserveAspectRatio="xMidYMid meet" role="img" aria-label={name}>
            <image href={`/media/client-logos/${file}`} width={window.width} height={window.height} />
          </svg> : <img src={`/media/client-logos/${file}`} alt={name} loading="lazy" decoding="async" />}
        </div>;
      })}
    </div>
    <p className="client-proof-note">以上为团队成员过往任职或项目经历中服务过的部分企业，不代表均为深拥智能直接签约客户。</p>
  </div>;
}
