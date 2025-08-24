import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';

import Root from '../components/aside.jsx';
import HomePage from '../pages/Home.jsx';
import ProjectPage from '../pages/Project.jsx';
import BacklogPage from '../components/Backlog.jsx';
import Board from "../components/Board.jsx";
import ProjectsOverview from '../pages/Project.jsx';
import AboutPage from '../pages/About.jsx';


function BoardPage() {
  return <Board />;
}

const projectsOverviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects',
  component: ProjectsOverview,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const rootRoute = createRootRoute({
  component: Root,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const projectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects/$projectId',
  component: ProjectPage,
});

const backlogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects/$projectId/backlog',
  component: BacklogPage,
});

const boardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/board',
  component: BoardPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  aboutRoute,
  projectsOverviewRoute,
  projectRoute,
  backlogRoute,
  boardRoute,
]);

export const router = createRouter({
  routeTree,
});

export const Router = () => <RouterProvider router={router} />;
