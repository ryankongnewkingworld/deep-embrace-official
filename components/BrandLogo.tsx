/** Render the supplied white artwork, including its original lettering.
 * The display filter makes the gray canvas transparent without redrawing it.
 */
export default function BrandLogo({id}:{id:string}) {
  const filterId = `${id}-white-artwork`;
  return <svg className="brand-lockup" viewBox="224 220 1580 358" preserveAspectRatio="xMidYMid meet" role="img" aria-label="深拥智能 · DEEP EMBRACE INTELLIGENT">
    <defs><filter id={filterId} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.375 0.375 0.375 0 -0.125" />
    </filter></defs>
    <image href="/media/logo.png" width="2048" height="814" filter={`url(#${filterId})`} />
  </svg>;
}
