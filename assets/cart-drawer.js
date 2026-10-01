class MiniCart extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
   
    this.header = document.querySelector('sticky-header');
    this.drawer = document.querySelector('cart-drawer');
    new IntersectionObserver(this.handleIntersection.bind(this)).observe(this);
  }

  handleIntersection(entries, observer) {
 
    if (!entries[0].isIntersecting) return;
    
    observer.unobserve(this);
  
    fetch(this.dataset.url)
      .then(response => response.text())
      .then(html => {
       
        document.getElementById('mini-cart').innerHTML =
          this.getSectionInnerHTML(html, '.shopify-section');
          
          document.dispatchEvent(new CustomEvent('cartdrawer:opened'));
      })
      .catch(e => {
        console.error(e);
      });
  }

  open() {
    const detailsElement = this.drawer.querySelector('details');
    if (detailsElement.hasAttribute('open')) {
  
      return;
    }
    
    this.drawer.openMenuDrawer();
  }

  renderContents(parsedState) {
    this.productId = parsedState.id;
    this.getSectionsToRender().forEach((section => {
      if (document.getElementById(section.id)) {
        document.getElementById(section.id).innerHTML =
          this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
      }
    }));

    this.open();
  }

  getSectionsToRender() {
    return [
      {
        id: 'mini-cart',
        section: 'mini-cart',
        selector: '.shopify-section'
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section'
      },
      {
        id: 'mobile-cart-icon-bubble',
        section: 'mobile-cart-icon-bubble',
        selector: '.shopify-section'
      }
      
    ];
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }

  setActiveElement(element) {
    this.activeElement = element;
  }

  
}

customElements.define('mini-cart', MiniCart);




/*
var button = document.querySelector('user-drawer details summary');
var body = document.querySelector('body');
button.addEventListener("click", function (event) {

  var mainDetailsToggle = this.parentNode;

   const summaryElement = event.currentTarget;
  
   const detailsElement = summaryElement.parentNode;
    const isOpen = detailsElement.hasAttribute('open');
   const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (detailsElement === mainDetailsToggle) {
      if (isOpen) event.preventDefault();
   
      isOpen ? closeMenuDrawer(event, summaryElement) : openMenuDrawer(summaryElement);
    } else {
      setTimeout(() => {
        mainDetailsToggle.setAttribute('open', '');
        detailsElement.classList.add('menu-opening');
        summaryElement.setAttribute('aria-expanded', true);
     });
  }


})
 function openMenuDrawer(e) {
     document.body.classList.add('user-mini-cart--opening');
      var main = e.closest('details');
      var urls = main.querySelector('.user-drawer ');
    fetch(urls.dataset.url)
      .then(response => response.text())
      .then(html => {
        console.log(main);
         document.body.classList.remove('user-mini-cart--opening');
         document.body.classList.add('user-mini-cart--open');
         main.classList.add('menu-opening');
        document.getElementById('user-mini-cart').innerHTML =
          this.getSectionInnerHTML(html, '.shopify-section');
      
      })
      .catch(e => {
        document.body.classList.remove('user-mini-cart--opening');
         document.body.classList.add('user-mini-cart--open');
        console.error(e);
      });
  }
  function closeMenuDrawer(event, elementToFocus = false) {
    
    if (event !== undefined) {
      console.log(elementToFocus,'main');
        document.querySelectorAll('details').forEach(details =>  {
        details.removeAttribute('open');
        details.classList.remove('menu-opening');
        details.classList.add('menu-closing');
        document.body.classList.add('user-mini-cart--closing');
        details.classList.remove('menu-closing');
      });
     document.body.removeEventListener('click', this.onBodyClickEvent);
      document.body.classList.remove('user-mini-cart--open');
   
      document.body.classList.remove('user-mini-cart--closing');
      
    }
  }
  function getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }


*/

