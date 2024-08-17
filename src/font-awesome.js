import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faTh,
  faMap,
  faFilter,
  faHeart as fasHeart,
  faLocationDot,
  faSun,
  faMoon,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import {
  faLaravel,
  faVuejs,
  faFacebookF,
  faTwitter,
  faWhatsapp,
  faTelegramPlane,
} from '@fortawesome/free-brands-svg-icons';

library.add(
  faTh,
  faMap,
  faFilter,
  fasHeart,
  farHeart,
  faLaravel,
  faTelegramPlane,
  faVuejs,
  faLocationDot,
  faSun,
  faMoon,
  faFacebookF,
  faTwitter,
  faWhatsapp
);

export { FontAwesomeIcon };
