function d(e){if(e==null)return"";const n=String(e);return/[",\r\n]/.test(n)?'"'+n.replace(/"/g,'""')+'"':n}function b(e,n,c){const i=c.map(r=>d(r.label)).join(","),p=n.map(r=>c.map(u=>d(r[u.prop])).join(",")).join(`\r
`),l="\uFEFF"+i+`\r
`+p+`\r
`,a=new Blob([l],{type:"text/csv;charset=utf-8;"}),s=URL.createObjectURL(a),t=document.createElement("a");t.href=s;const o=e&&e.trim()?e.trim():"export";t.download=/\.csv$/i.test(o)?o:o+".csv",t.style.display="none",document.body.appendChild(t),t.click(),document.body.removeChild(t),URL.revokeObjectURL(s)}export{b as e};
