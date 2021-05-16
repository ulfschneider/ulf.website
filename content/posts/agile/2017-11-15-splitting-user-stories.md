---
title: Splitting User Stories
abstract:  A User Story can cover vast amounts of functionality with a single sentence, which requires a team many weeks or even months of work to get it done (often called epic). Splitting such stories into pieces which are valuable for users and still deliverable within a Sprint is challenging for many teams. However, there are good reasons why you should do it.
---
User Stories are short and simple descriptions of a feature told from the perspective of the person who desires the new capability, usually a user or customer of the system. It´s called User Story because you put the user into focus. Therefore a User Story should lead to a product increment that can be seen valuable from the user- or business perspective. 

[[toc]]

## The advantage of splitting

A User Story can cover vast amounts of functionality with a single sentence, which requires a team many weeks or even months of work to get it done. Such stories are often called epics. Splitting such stories into pieces which are valuable for users and still deliverable within a Sprint is challenging for many teams. However, there are good reasons why you should do it:

- A smaller piece is faster to be delivered than a bigger one, which will bring you in a quicker feedback loop to spot defects in design, code, usability and integration. The sooner a mistake is identified, the less it will cost to fix, and the more time you have to adapt.
- As you work on small pieces, which can flow smoothly among the professions, like developers, QA engineers, UX/UI engineers, no one has to wait for long while a considerable bunch of work has to get done until the next person can take over.
- A smaller feature is much easier to understand, and there is less likelihood of a lack of consensus between team members.
- When slicing a significant function into smaller pieces, you will often realize that not every single bit is required, this will help you to reduce coding, testing, documentation and everything else you need to do to get your software delivered.
- Small slices allow the team to get small wins on an almost daily basis, leading to much higher engagement.
- Your daily scrums become far more exciting and useful. Instead of "yeah, I'm 20% done adding all of the new schemas to the DB," you get "for that story we got the time stamps working in the UI, and today we're going to make the data persist."
- A smaller size tends to make estimates more accurate (though estimates are not too important, as your stories should be small anyway).

## JIRA is time-consuming for splitting

Trying to break down a User Story within JIRA is very time-consuming and sometimes counter-intuitive. Not to mention that interaction and conversations among people are to be avoided when following this approach, which is the opposite of what you should thrive for. Use a whiteboard or a wall and sticky notes to do the split work, be prepared to change quickly, sketch, refactor and enhance. Only after you have understood what the story is about and how to split in a good way, bring the parts into JIRA.

## Layers

For engineers who are new to the splitting approach, breaking down stories and still delivering end-to-end functionality within a Sprint is among the most challenging things. That´s because engineers are mostly concerned about finding a way for how to solve the given problem. Their thinking tools have to do with architectural layers, technical components, frameworks and programming languages. Naturally, engineers start splitting by layers, like UI, Business Logic, DB Access, DB, Operating System. Following this approach, they end up with stories for the different architectural layers which will be implemented separately and eventually have to be integrated, which will allow only very late feedback. None of these architecture-layer stories alone will bring value for the user, and in most cases, it´s impossible to come up with a solution during a single Sprint.

Also, organizational structures are often formed by their corresponding architecture layers, for example, UI/UX people form an organizational unit, Java developers form a unit, technical writers form a unit, QA engineers form a unit and so on. These units sometimes are called teams. In many cases, none of these "teams" alone can deliver a valuable feature to the user. Which means, costs in terms of understanding, splitting, designing, building, testing and putting into operation are pretty high because the different "teams" need to be coordinated and are interdependent up to the level that they are blocking each other because everyone is waiting for someone else to get work done.

Therefore, when talking about splitting User Stories, it´s meant to cut across all layers to come up with end-to-end solutions in each Sprint. The organizational structures have to follow to achieve a delivery-oriented organization. Which leads to small, cross-functional teams, having every skill on-board that is needed to split, design, build, describe, test and deliver an end-to-end feature. This will speed up the feedback loop drastically and thus allows to speed up learning accordingly. The organizational change, of course, is difficult and requires experience and insight. The goal is to have teams being able to operate quick, with minimal interdependencies and end-to-end.

## Patterns

Try the following patterns to split your User Stories:

- **Testing:** When identifying and describing the testable aspects of a User Story, you are already in the kind of thinking that is needed to split the story end-to-end. Thus you have an excellent indication of how to break the story down. Often the essential testable aspects of a Story are described in the so-called acceptance criteria. Just pick that up and use it for your split. This is a perfect way to have QA engineers engaged right from the start.
- **CRUD Operations:** Sometimes you can split a story by its CRUD operations. Watch out for the phrase "manage" in a User Story description – often this indicates a splitting opportunity into Create, Read, Update and Delete parts.
- **Happy and Unhappy:** If you have to take care about things that might go wrong in a User Story, you can use a split for the light flow, where everything goes well and in addition split into the exceptions (unhappy flows), where you handle the problems.
- **Connectors:** User Story descriptions containing connectors like AND, OR, WHEN, IF point you to splitting opportunities.
- **Parameters and Result:** Parameters which determine the function and possible result of a User Story can be used to divide the story. Depending on the number of parameters or the contents of a setting, or the different expected results, you can split along those parameter and result lines.
- **Roles:** In case a User Story describes something that has to be used by different people, groups or roles (e.g. customer, shopper, admin, editor), a split by role might be a good choice. Often you can combine this splitting strategy with the workflow step pattern below, as workflows tend to connect roles via action steps.
- **Workflow Steps:** If a User Story describes a workflow, elaborate if you can make at first two stories, one for the start of the workflow and one for the ending. Followed by subsequent stories which fill the gaps from both endpoints up to the middle.
- **Simple and Complex:** Sometimes you can do a pure core first and subsequently do complex enhancements in additional stories. The workflow steps pattern is some kind of simple and complex pattern, but you can apply simple/complex even without thinking in workflows.
- **Platform:** If you have to support different devices or operating systems (more general: platforms) with a User Story, a natural split is by platform. 
- **Vague Terms:** Vague terms offer splitting opportunities by asking what exactly is meant, turning the vagueness into concrete and then applying the above patterns.

## Concerns

Of course, there are teams considering the splitting process to be wasteful and instead finding the implementation of an unsplit functionality to its completeness to be more straightforward and efficient. Recalling one of the advantages from the beginning: Smaller pieces allow faster feedback. Correction at an early point is more direct, much cheaper and will improve your results.

Everything in agile software development is about feedback and results. This is because learning is an outcome of feedback and learning on all levels (individual and team) is considered to be the essential ingredient of good software development. Therefore you should give splitting a try!
