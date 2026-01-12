"use client";

import { useEffect } from "react";

export default function ZohoChat(): null {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "zsiqchat";
    script.innerHTML = `
      var $zoho=$zoho || {};$zoho.salesiq = $zoho.salesiq || {widgetcode: "a32d5ee98f03e09afe845d0a916872a1e9a3e82e46d170f215ada0475ca4fccec929473aea5443cba489ea70ec85ac38", values:{},ready:function(){}};var d=document;s=d.createElement("script");s.type="text/javascript";s.id="zsiqscript";s.defer=true;s.src="https://salesiq.zoho.com/widget";t=d.getElementsByTagName("script")[0];t.parentNode.insertBefore(s,t);
    `;

    document.body.appendChild(script);

    // return () => {
    //   const scriptToRemove = document.getElementById("zsiqchat");
    //   if (scriptToRemove && scriptToRemove.parentNode) {
    //     scriptToRemove.parentNode.removeChild(scriptToRemove);
    //   }
    //   const zsiqscript = document.getElementById("zsiqscript");
    //   if (zsiqscript && zsiqscript.parentNode) {
    //     zsiqscript.parentNode.removeChild(zsiqscript);
    //   }
    // };
  }, []);

  return null;
}
