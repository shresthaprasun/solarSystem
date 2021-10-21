import { Project } from "./project";

if (window) {
    (<any>window).project = new Project();
}