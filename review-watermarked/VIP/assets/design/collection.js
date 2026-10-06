/* Website 7 presentation-only enhancements. No property data is changed. */
(() => {
  const map = document.getElementById('location-map');
  const contact = document.getElementById('contact');
  // Let location context lead into the final invitation, rather than follow it.
  if (map && contact) contact.before(map);
  const navigation = document.getElementById('navigation');
  if (navigation && !navigation.querySelector('[href="#location-map"]')) {
    const link = document.createElement('a');
    link.href = '#location-map';
    link.textContent = 'Location';
    navigation.insertBefore(link, navigation.querySelector('.button'));
  }
  const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  // Match navigation to the actual final document order, including moved map content.
  links.sort((a,b)=>{
    const first=document.getElementById(a.hash.slice(1)),second=document.getElementById(b.hash.slice(1));
    if(!first||!second||first===second)return 0;
    return first.compareDocumentPosition(second)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1;
  }).forEach(link=>navigation.append(link));
  const iconPaths=[
    'M4 3v7m3-7v7m-6-7v7m0 0h6M4 10v11M16 3v18m0-18c5 3 5 9 0 9',
    'M3 12h18v9H3zM3 16h18M7 12V8h10v4M12 8V4m-1-2h2',
    'M12 21v-9m0 4c-6 0-8-3-8-3m8 5c6 0 8-3 8-3M12 12c-8-1-8-7-4-7 0-5 8-5 8 0 4 0 4 6-4 7',
    'M3 7h5l2-3h4l2 3h5v14H3zM16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
    'M3 5h13v14H3zM16 10l5-3v10l-5-3',
    'M9 18V5l11-2v13M9 18c0 4-7 4-7 0s7-4 7 0m11-2c0 4-7 4-7 0s7-4 7 0',
    'M5 21V10a7 7 0 0 1 14 0v11M2 21h20M8 12l4 4 4-4',
    'M5 3l14 18M5 21L19 3M7 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0m0 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
    'M2 4h20L12 15zM7 9l5 6 5-6M12 15v7',
    'M2 11L12 2l10 9H2zm3 0v11m14-11v11M8 22V12h8v10',
    'M4 2h16v20H4zM7 5h10v9H7zM8 18h8',
    'M4 7l2-4h12l2 4v12H4zM4 12h16M7 19v3m10-3v3M7 16h1m8 0h1',
    'M3 21V3h18v18M8 21v-6h8v6M7 7h2m6 0h2M7 11h2m6 0h2'
  ];
  document.querySelectorAll('.network-category summary').forEach((summary,index)=>{
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('class','network-icon');svg.setAttribute('aria-hidden','true');
    const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',iconPaths[index]||iconPaths[0]);svg.append(path);summary.prepend(svg);
  });
  document.querySelectorAll('video').forEach(video=>{
    const fit=()=>{if(video.videoWidth&&video.videoHeight)video.style.aspectRatio=video.videoWidth+'/'+video.videoHeight;};
    video.addEventListener('loadedmetadata',fit);fit();
    video.preload='metadata';
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const active = entries.find(entry => entry.isIntersecting);
      if (!active) return;
      links.forEach(link => {
        if (link.hash === '#' + active.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
    links.forEach(link => {
      const section = document.getElementById(link.hash.slice(1));
      if (section) observer.observe(section);
    });
  }
})();
