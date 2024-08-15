// codeminer/frontend_codeminer/__mocks__/next/router.js
import {jest} from "@jest/globals";

export const useRouter = jest.fn().mockReturnValue({
    route: '/',
    pathname: '',
    query: {},
    asPath: '',
});
