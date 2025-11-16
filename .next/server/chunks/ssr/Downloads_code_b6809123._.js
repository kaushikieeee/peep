module.exports=[66556,(a,b,c)=>{"use strict";b.exports=a.r(55932).vendored["react-ssr"].ReactJsxRuntime},15696,(a,b,c)=>{"use strict";b.exports=a.r(55932).vendored["react-ssr"].ReactServerDOMTurbopackClient},6481,a=>{"use strict";var b=a.i(95820);let c=(...a)=>a.filter((a,b,c)=>!!a&&""!==a.trim()&&c.indexOf(a)===b).join(" ").trim();var d={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let e=(0,b.forwardRef)(({color:a="currentColor",size:e=24,strokeWidth:f=2,absoluteStrokeWidth:g,className:h="",children:i,iconNode:j,...k},l)=>(0,b.createElement)("svg",{ref:l,...d,width:e,height:e,stroke:a,strokeWidth:g?24*Number(f)/Number(e):f,className:c("lucide",h),...k},[...j.map(([a,c])=>(0,b.createElement)(a,c)),...Array.isArray(i)?i:[i]])),f=(a,d)=>{let f=(0,b.forwardRef)(({className:f,...g},h)=>(0,b.createElement)(e,{ref:h,iconNode:d,className:c(`lucide-${a.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,f),...g}));return f.displayName=`${a}`,f};a.s(["default",()=>f],6481)},32479,a=>{"use strict";let b=(0,a.i(6481).default)("MapPin",[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);a.s(["MapPin",()=>b],32479)},15443,a=>{"use strict";let b=(0,a.i(6481).default)("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);a.s(["X",()=>b],15443)},19573,a=>{"use strict";let b=(0,a.i(6481).default)("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);a.s(["Menu",()=>b],19573)},1439,a=>{"use strict";let b=(0,a.i(6481).default)("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);a.s(["User",()=>b],1439)},44051,a=>{"use strict";var b=a.i(66556),c=a.i(95820),d=a.i(80591),e=a.i(19573),f=a.i(15443),g=a.i(32479),h=a.i(1439);let i=(0,a.i(6481).default)("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);function j(){let[a,d]=(0,c.useState)(!0);return(0,c.useEffect)(()=>{let a=setTimeout(()=>{d(!1)},5e3);return()=>clearTimeout(a)},[]),(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("style",{children:`
        @keyframes peepFadeInOut {
          0% {
            opacity: 1;
            pointer-events: auto;
          }
          85% {
            opacity: 1;
            pointer-events: auto;
          }
          100% {
            opacity: 0;
            pointer-events: none;
            visibility: hidden;
          }
        }

        @keyframes dotBlinkYellow {
          0%, 20% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        .peep-footer-text {
          position: absolute;
          bottom: 60px;
          font-size: 0.8rem;
          font-weight: 600;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
            sans-serif;
          color: #FCD34D;
          letter-spacing: 0.05em;
        }

        .peep-loading-overlay {
          animation: peepFadeInOut 5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #000000;
        }

        .peep-text-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
        }

        .peep-main-text {
          display: flex;
          align-items: baseline;
          justify-content: center;
          line-height: 1;
        }

        .peep-tagline {
          font-size: 0.85rem;
          font-weight: 500;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
            sans-serif;
          color: #FCD34D;
          letter-spacing: 0.03em;
          margin-top: 0;
          line-height: 1.1;
        }

        .peep-loading-text {
          font-size: 4rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
            sans-serif;
          color: #FFFFFF;
          text-align: center;
          position: relative;
          z-index: 10;
        }

        .peep-loading-dot {
          display: inline-block;
          animation: dotBlinkYellow 1.2s ease-in-out infinite;
          color: #FBBF24;
        }

        .peep-glow-bottom {
          position: absolute;
          bottom: -50px;
          left: 0;
          right: 0;
          height: 400px;
          background: linear-gradient(
            to top,
            rgba(167, 139, 250, 1) 0%,
            rgba(139, 92, 246, 0.8) 10%,
            rgba(109, 40, 217, 0.5) 25%,
            transparent 60%
          );
          filter: blur(80px);
          pointer-events: none;
          z-index: 5;
        }
      `}),a&&(0,b.jsxs)("div",{className:"peep-loading-overlay",children:[(0,b.jsx)("div",{className:"peep-glow-bottom"}),(0,b.jsxs)("div",{className:"peep-text-wrapper",children:[(0,b.jsxs)("div",{className:"peep-main-text peep-loading-text",children:["peep",(0,b.jsx)("span",{className:"peep-loading-dot",children:"."})]}),(0,b.jsx)("div",{className:"peep-tagline",children:"a community driven approach"})]}),(0,b.jsx)("div",{className:"peep-footer-text",children:"GRD PUBLIC SCHOOL"})]})]})}function k({isOpen:a,onClose:c}){return a?(0,b.jsx)("div",{className:"fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4",children:(0,b.jsxs)("div",{className:"bg-black border border-gray-700 rounded-lg max-w-2xl max-h-[90vh] overflow-y-auto",children:[(0,b.jsxs)("div",{className:"sticky top-0 bg-black border-b border-gray-700 px-6 py-4 flex items-center justify-between",children:[(0,b.jsx)("h2",{className:"text-2xl font-bold text-white",children:"About PEEP"}),(0,b.jsx)("button",{onClick:c,className:"text-gray-400 hover:text-white p-1","aria-label":"Close",children:(0,b.jsx)(f.X,{className:"w-6 h-6"})})]}),(0,b.jsxs)("div",{className:"px-6 py-6 text-gray-300 space-y-6",children:[(0,b.jsxs)("section",{children:[(0,b.jsx)("h3",{className:"text-xl font-bold text-yellow-400 mb-3",children:"Project Overview"}),(0,b.jsx)("p",{className:"text-sm leading-relaxed",children:"PEEP is a community-driven approach to environmental monitoring and reporting. Our platform empowers citizens to report environmental issues, track their status, and collaborate with authorities to create a cleaner, healthier community. With features for real-time mapping, evidence management, and authority escalation, PEEP bridges the gap between citizens and environmental officials."})]}),(0,b.jsxs)("section",{children:[(0,b.jsx)("h3",{className:"text-xl font-bold text-yellow-400 mb-3",children:"Technology Stack"}),(0,b.jsxs)("div",{className:"space-y-3 text-sm",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"font-semibold text-white",children:"Languages"}),(0,b.jsx)("p",{children:"TypeScript, JavaScript"})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"font-semibold text-white",children:"Frontend Framework"}),(0,b.jsx)("p",{children:"Next.js 16.0.3 with React 19, Tailwind CSS 4"})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"font-semibold text-white",children:"Build Tool"}),(0,b.jsx)("p",{children:"Turbopack (bundler for Next.js)"})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"font-semibold text-white",children:"UI Components & Icons"}),(0,b.jsx)("p",{children:"Custom UI library with Lucide React icons"})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"font-semibold text-white",children:"Package Manager"}),(0,b.jsx)("p",{children:"npm / pnpm"})]})]})]}),(0,b.jsxs)("section",{children:[(0,b.jsx)("h3",{className:"text-xl font-bold text-yellow-400 mb-3",children:"Database & Backend"}),(0,b.jsxs)("div",{className:"space-y-3 text-sm",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"font-semibold text-white",children:"Primary Data Source"}),(0,b.jsx)("p",{children:"Google Sheets API for evidence and reports management"})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"font-semibold text-white",children:"Backend API"}),(0,b.jsx)("p",{children:"Next.js API Routes (server-side rendering and API endpoints)"})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"font-semibold text-white",children:"Geolocation"}),(0,b.jsx)("p",{children:"Browser Geolocation API for user location tracking"})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"font-semibold text-white",children:"Data Format"}),(0,b.jsx)("p",{children:"JSON-based REST API responses"})]})]})]}),(0,b.jsxs)("section",{children:[(0,b.jsx)("h3",{className:"text-xl font-bold text-yellow-400 mb-3",children:"Architecture & Setup"}),(0,b.jsxs)("div",{className:"space-y-3 text-sm",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"font-semibold text-white",children:"Frontend Architecture"}),(0,b.jsx)("p",{children:"Client-side components with React hooks, server-side data fetching, and dynamic routing"})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"font-semibold text-white",children:"Module Structure"}),(0,b.jsxs)("ul",{className:"list-disc list-inside space-y-1 mt-2",children:[(0,b.jsx)("li",{children:"/app - Page routes (admin, peep user sections)"}),(0,b.jsx)("li",{children:"/components - Reusable UI components"}),(0,b.jsx)("li",{children:"/lib - Utilities and API helpers"}),(0,b.jsx)("li",{children:"/styles - Global styling and animations"}),(0,b.jsx)("li",{children:"/data - Mock data and seed files"})]})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"font-semibold text-white",children:"Key Features"}),(0,b.jsxs)("ul",{className:"list-disc list-inside space-y-1 mt-2",children:[(0,b.jsx)("li",{children:"Real-time interactive mapping with live pin updates"}),(0,b.jsx)("li",{children:"Evidence escalation system to authorities"}),(0,b.jsx)("li",{children:"Bulk operations for evidence management"}),(0,b.jsx)("li",{children:"Statistical dashboard with analytics"}),(0,b.jsx)("li",{children:"Advanced filtering and search capabilities"}),(0,b.jsx)("li",{children:"Responsive design for mobile and desktop"})]})]})]})]}),(0,b.jsxs)("section",{children:[(0,b.jsx)("h3",{className:"text-xl font-bold text-yellow-400 mb-3",children:"Environment & Deployment"}),(0,b.jsxs)("div",{className:"space-y-3 text-sm",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"font-semibold text-white",children:"Development Server"}),(0,b.jsx)("p",{children:"Next.js Dev Server (localhost:3001)"})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"font-semibold text-white",children:"Build Process"}),(0,b.jsx)("p",{children:"Next.js with TypeScript strict mode, zero compilation errors"})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"font-semibold text-white",children:"Configuration"}),(0,b.jsx)("p",{children:"Environment variables via .env.local for API endpoints and sensitive data"})]})]})]}),(0,b.jsxs)("section",{children:[(0,b.jsx)("h3",{className:"text-xl font-bold text-yellow-400 mb-3",children:"Team"}),(0,b.jsxs)("div",{className:"space-y-2 text-sm",children:[(0,b.jsx)("p",{children:"Created by:"}),(0,b.jsxs)("div",{className:"space-y-2 ml-4",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)("span",{className:"w-2 h-2 bg-yellow-400 rounded-full"}),(0,b.jsx)("span",{children:"Pragadeesh"})]}),(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)("span",{className:"w-2 h-2 bg-yellow-400 rounded-full"}),(0,b.jsx)("span",{children:"Aadhityan"})]}),(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)("span",{className:"w-2 h-2 bg-yellow-400 rounded-full"}),(0,b.jsx)("span",{children:"Yashwanth"})]})]})]})]}),(0,b.jsxs)("section",{children:[(0,b.jsx)("h3",{className:"text-xl font-bold text-yellow-400 mb-3",children:"Support & Contribution"}),(0,b.jsx)("p",{className:"text-sm leading-relaxed",children:"PEEP is built with the community in mind. We welcome feedback, bug reports, and feature suggestions to make environmental monitoring more accessible and effective."})]})]})]})}):null}function l({children:a}){let[l,m]=(0,c.useState)(!1),[n,o]=(0,c.useState)(!1);return(0,b.jsxs)("div",{className:"min-h-screen bg-black flex flex-col",children:[(0,b.jsx)(j,{}),(0,b.jsxs)("header",{className:"sticky top-0 z-50 bg-black border-b border-gray-800 px-4 py-3",children:[(0,b.jsxs)("div",{className:"flex items-center justify-between",children:[(0,b.jsx)("h1",{className:"text-xl font-bold text-yellow-400",children:"PEEP"}),(0,b.jsx)("button",{onClick:()=>m(!l),className:"p-2 rounded-lg hover:bg-gray-900 text-white","aria-label":"Toggle menu",children:l?(0,b.jsx)(f.X,{className:"w-5 h-5"}):(0,b.jsx)(e.Menu,{className:"w-5 h-5"})})]}),l&&(0,b.jsxs)("nav",{className:"mt-3 space-y-2 pb-3 border-t border-gray-800 pt-3",children:[(0,b.jsx)(d.default,{href:"/peep/user",className:"block py-2 px-2 rounded hover:bg-gray-900 text-gray-300 hover:text-white",children:"Home"}),(0,b.jsxs)(d.default,{href:"/peep/user/map",className:"block py-2 px-2 rounded hover:bg-gray-900 text-gray-300 hover:text-white flex items-center gap-2",children:[(0,b.jsx)(g.MapPin,{className:"w-4 h-4"})," Map"]}),(0,b.jsxs)(d.default,{href:"/peep/user/profile",className:"block py-2 px-2 rounded hover:bg-gray-900 text-gray-300 hover:text-white flex items-center gap-2",children:[(0,b.jsx)(h.User,{className:"w-4 h-4"})," Profile"]}),(0,b.jsxs)("button",{onClick:()=>{o(!0),m(!1)},className:"w-full text-left py-2 px-2 rounded hover:bg-gray-900 text-gray-300 hover:text-white flex items-center gap-2",children:[(0,b.jsx)(i,{className:"w-4 h-4"})," About Us"]})]})]}),(0,b.jsx)("main",{className:"flex-1 overflow-y-auto pb-24 text-white",children:a}),(0,b.jsx)(k,{isOpen:n,onClose:()=>o(!1)})]})}a.s(["default",()=>l],44051)}];

//# sourceMappingURL=Downloads_code_b6809123._.js.map