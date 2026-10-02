// 장바구니는 스프링 세션에 저장되므로 쿠키를 주고받는 sessionFetch를 그대로 사용
export { sessionFetch as cartFetch } from "../../dogs/api/spring";
