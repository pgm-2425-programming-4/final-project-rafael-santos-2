import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router'

import HomePage from '../pages/Home'
import AboutPage from '../pages/About'
import ProjectPage from '../pages/Project'
import BacklogPage from '../pages/Backlog'
import Root from '../__Root'


const rootRoute = createRootRoute({
  component: Root,
})



const indexRoute = createRoute({
    getParentRoute:() => rootRoute,
    path: '/',
    component: HomePage,
});

const aboutRoute = createRoute({
    getParentRoute:() => rootRoute,
    path: '/about',
    component: AboutPage,
});

const BacklogRoute = createRoute({
    getParentRoute:() => rootRoute,
    path: '/projects/:projectId/backlog',
    component: BacklogPage,
});


const ProjectRoute = createRoute({
    getParentRoute:() => rootRoute,
    path: '/projects/:projectId',
    component: ProjectPage,
});


const routeTree = rootRoute.addChildren([
    indexRoute,
    aboutRoute,
    ProjectRoute,
    BacklogRoute,
]);

export const router = createRouter({
    routeTree,
});


export const Router = () => <RouterProvider router={router} />

