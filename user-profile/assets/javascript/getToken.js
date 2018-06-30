'use strict';
(function () {

    const currentLink = window.location.href;

    function getLink(link) {
        const linkHref = new URL(link);
        const tokenParam = new URLSearchParams(linkHref.search.slice(1));
        const linkSearch = new URLSearchParams(linkHref.search);
        const hasTokenParam = tokenParam.has('token');

        if(hasTokenParam) {
            return linkSearch.get('token'); 
        } else {
            return 'no token param'
        }
        
    }
    
   console.log(getLink(currentLink));
}());