const app = {
   state: {
      loading: false,
      freeContentBlurred: false
   }
}
const userInfo = {
   name: null,
   level: 0,
   loggedIn: false,
   subscription: {
      list: []
   }
}
const computed = {
   isPremium: () => userInfo.level == 1,
   freeContent: [6, 2, 3, 4],
   premiumContent: [1, 5]
}

!function () {
   window.addEventListener("load", () => {
      const modal = document.querySelector("#modal");
      modal.className = "ready no-show"

      addEventToWebinarFeature();
      addBlurryFilter();
      addGetPremiumButton();
   })
}()

function addEventToWebinarFeature() {
   let premiumContentButton = document.querySelectorAll(".premiumContent");
   let freeContentButton = document.querySelectorAll(".freeContent")
   let closeButtons = document.querySelectorAll(".modalController");

   premiumContentButton = [...premiumContentButton];
   premiumContentButton.map(feature => feature.addEventListener("click", e => {
      if (computed.isPremium()) {
         subscribe(e.target);
      } else {
         callBlockedContent();
      }
   }))

   freeContentButton = [...freeContentButton];
   freeContentButton.map(feature => feature.addEventListener("click", e => subscribe(e.target)))

   closeButtons = [...closeButtons];
   closeButtons.map(button => button.addEventListener("click", () => {
      closeModal();
   }))
}

function callBlockedContent() {
   const $modal = showModal(true);
   const $outerWrapper = document.querySelector(".bodyWrapper");

   $outerWrapper.classList.add("blur");
   $modal.querySelector(".blockedContent").setAttribute("state", "visible");
}

function showModal(setter) {
   setter = setter >>> 0;
   setter = !!setter;

   const $modal = document.querySelector("#modal");
   _cleanAllInnerContent = () => {
      let list = $modal.querySelectorAll("[state]");

      list = [...list];
      list.map(el => el.setAttribute("state", "hidden"));
   }

   if (setter) {
      $modal.classList.remove("no-show");
      $modal.classList.add("show");

      _cleanAllInnerContent();
   } else {
      _cleanAllInnerContent();

      $modal.classList.remove("show");
      $modal.classList.add("no-show");
   }
   return $modal;
}

function closeModal() {
   const $outerWrapper = document.querySelector(".bodyWrapper");

   showModal(false);
   setTimeout(() => $outerWrapper.classList.remove("blur"), 300);
}

function buttonLoading(el, setter) {
   if (el.tagName !== "BUTTON") {
      var loopCounter = 0;
      while (el.tagName !== "BUTTON") {
         loopCounter++
         if (loopCounter > 5) break;
         el = el.parentNode;
      }
   }
   el.setAttribute("loading", setter);
}

function subscribe(el) {
   let $parentNode = el.parentNode.parentNode.parentNode;
   const title = $parentNode.querySelector(".title").innerText;
   const key = $parentNode.getAttribute("eventKey");

   const subscriptions = userInfo.subscription.list;
   _joinEvent = keyValue => new Promise((resolve, reject) => {
      if (verifyApp()) {
         reject("Subscription is being processed!");
         return
      } else {
         app.state.loading = true;
      }
      setTimeout(() => {
         if (subscriptions.includes(key)) {
            reject("Already joined this event!");
         }
         subscriptions.push(keyValue);
         resolve(keyValue);
      }, 300);
   });

   buttonLoading(el, true);
   _joinEvent(key)
      .then(() => {
         alertNewEvent(title);
         buttonLoading(el, false);
         app.state.loading = false;
      })
      .catch(e => {
         callError(e);
         buttonLoading(el, false);
         app.state.loading = false;
      });
}

function alertNewEvent(title) {
   const $snackbar = document.querySelector("#snackbar");

   $snackbar.querySelector("#changeable").textContent = title;
   $snackbar.classList.add("show");
   setTimeout(() => {
      $snackbar.classList.remove("show");
   }, 2000);
}
function callError(error) {
   const $snackbar = document.querySelector("#snackbarError");

   $snackbar.querySelector("#changeable").textContent = error;
   $snackbar.classList.add("show");
   setTimeout(() => {
      $snackbar.classList.remove("show");
   }, 2000);
}

function verifyApp() {
   return !!app.state.loading;
}

function addBlurryFilter() {
   const $button = document.querySelector("#blurryFilter");

   $button.addEventListener("click", () => {
      if (app.state.freeContentBlurred) {
         removeFreeContentBlur();
      } else {
         addFreeContentBlur();
      }
   })
}

function addFreeContentBlur() {
   app.state.freeContentBlurred = true;
   computed.freeContent.map(key => {
      let $content = document.querySelector(`[eventKey="${key}"]`);
      $content.classList.add("blurry");
   })
   computed.premiumContent.map(key => {
      let $content = document.querySelector(`[eventKey="${key}"]`);
      $content.classList.remove("jump");
      $content.classList.add("jump");
   })
}

function removeFreeContentBlur() {
   app.state.freeContentBlurred = false;
   let $elements = document.querySelectorAll("[eventKey]");
   $elements = [...$elements];
   $elements.map($el => {
      $el.classList.remove("blurry");
      $el.classList.remove("jump");
   })
}

function addGetPremiumButton() {
   const $button = document.querySelector("#premiumCTA");
   $button.addEventListener("click", () => {
      userInfo.level = 1;
      closeModal(true);
   })
}