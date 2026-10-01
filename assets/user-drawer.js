class MiniUser extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
   
    this.header = document.querySelector('sticky-header');
    this.drawer = document.querySelector('user-drawer');
    new IntersectionObserver(this.handleIntersection.bind(this)).observe(this);
  }

  handleIntersection(entries, observer) {
   
    if (!entries[0].isIntersecting) return;
    
    observer.unobserve(this);
  
    fetch(this.dataset.url)
      .then(response => response.text())
      .then(html => {
       
        document.getElementById('user-mini-cart').innerHTML =
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
        id: 'user-mini-cart',
        section: 'login-popup',
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

customElements.define('user-mini-cart', MiniUser);
function accounts(e){
   // document.getElementById('user-mini-cart').innerHTML =`<div class="loading-overlay"><div class="loading-overlay__spinner">{% render 'icon', icon: 'spinner' %}</div></div>`;
    fetch(e.dataset.url)
      .then(response => response.text())
      .then(html => {
         
        document.getElementById('user-mini-cart').innerHTML =
          this.getSectionInnerHTML(html, '.shopify-section');
          
          document.dispatchEvent(new CustomEvent('cartdrawer:opened'));
      })
      .catch(e => {
        console.error(e);
      });
}
function getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }