// // src/font-awesome.js
//
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// import {
//   faTh, faMap, faFilter, faHeart as fasHeart, faLocationDot,
//   faSun, faMoon // Add sun and moon icons here
// } from '@fortawesome/free-solid-svg-icons';
// import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons'; // Import regular heart icon
// import { faLaravel, faVuejs } from '@fortawesome/free-brands-svg-icons'; // Import brand icons
//
// // Add the icons to the library
// library.add(
//   faTh, faMap, faFilter, fasHeart, farHeart,
//   faLaravel, faVuejs, faLocationDot, faSun, faMoon
// );
//
// export { FontAwesomeIcon };

// src/font-awesome.js

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faTh,
  faMap,
  faFilter,
  faHeart as fasHeart,
  faLocationDot,
  faSun,
  faMoon, // Correctly add sun and moon icons here
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons'; // Import regular heart icon
import { faLaravel, faVuejs } from '@fortawesome/free-brands-svg-icons'; // Import brand icons

// Add the icons to the library
library.add(
  faTh,
  faMap,
  faFilter,
  fasHeart,
  farHeart,
  faLaravel,
  faVuejs,
  faLocationDot,
  faSun,
  faMoon // Ensure the sun and moon icons are added
);

export { FontAwesomeIcon };
