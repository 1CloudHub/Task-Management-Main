import { gql } from "@apollo/client/core";

export const CATEGORY_LIST_QUERY = gql`
  query CATEGORYLIST {
    getCategories {
      categoryId
      name
      createdBy
    }
  }
`;

export const GET_SUB_CATEGORY_BY_CATEGORY_ID_QUERY = gql`
  query GETSUBCATEGORYBYCATEGORYID($categoryId: Int!) {
    getSubCategoriesByCategoryId(categoryId: $categoryId) {
      subCategoryId
      name
    }
  }
`;

export const GET_SUB_SUB_CATEGORY_BY_CATEGORY_ID_QUERY = gql`
  query GET_SUB_SUB_CATEGORY($subCategoryId: Int!) {
    getSubSubCategoriesBySubCategoryId(subCategoryId: $subCategoryId) {
      subCategoryId
      name
    }
  }
`;

export const CREATE_TASK_MUTATE = `
  mutation ($input: CreateTaskInput!) {
    createTask(input: $input) {
      taskId
      taskGroupId
      title
      description
      referenceTaskId
      createdBy
      categoryId
      subCategoryId
      subSubCategoryId
      dueDate {
        formatString(format: "dd/MM/yyyy")
      }
    }
  }
`;

export const GET_USERS_QUERY = gql`
  query USERSLIST {
    getUsers {
      userId
      emailAddress
      inactive
    }
  }
`;

export const FILTERED_TASK_QUERY = gql`
  query GETALLTASK($request: SearchRequest) {
    getFilteredTasks(request: $request) {
      title
      description
      status
      taskId
      categoryId
      createdBy
      createdByName
      statusName
      currentAssignee
      currentAssigneeName
      dueDate {
        formatString(format: "dd-MMM-yy")
      }
    }
  }
`;

export const GET_TASK_FOR_WATCHERS_QUERY = gql`
  query GETWATCHERSTASK($userId: ID!) {
    getTasksWatchedBy(userId: $userId) {
      title
      description
      status
      taskId
      categoryId
      createdBy
      createdByName
      statusName
      currentAssignee
      currentAssigneeName
      dueDate {
        formatString(format: "dd-MMM-yy")
      }
    }
  }
`;

export const GETUSERIDBBYEMAIL_QUERY = gql`
  query USERIDBYEMAIL($emailAddress: String!) {
    getUser(emailAddress: $emailAddress) {
      userId
      emailAddress
    }
  }
`;

export const GET_FILES_QUERY = gql`
  query getFILES($taskId: ID!) {
    getWork(taskId: $taskId) {
      task {
        taskId
      }
      taskLogs {
        from
        fromName
        to
        toName
        start_date {
          formatString(format: "dd-MMM-yyyy")
        }
        end_date {
          formatString(format: "dd-MMM-yyyy")
        }
        taskFiles {
          fileName
          uuid
        }
      }
      watchers {
        watcherId
        watcherName
      }
    }
  }
`;

export const RE_ASSIGNTASK_QUERY = `
  mutation REASSIGNTASK($input: TaskOperationInput!) {
    reassignTask(input: $input) {
      status
      statusName
    }
  }
`;

export const RESOLVE_TASK_QUERY = `
  mutation RESOLVETASK($input: TaskResolutionInput!) {
    resolveTask(input: $input) {
      status
      statusName
    }
  }
`;
export const CLOSE_TASK_QUERY = `
  mutation CLOSETASK($input: TaskOperationInput!) {
    closeTask(input: $input) {
      status
      statusName
    }
  }
`;
export const REOPEN_TASK_QUERY = `
  mutation REPOPENTASK($input: TaskOperationInput!) {
    reopenTask(input: $input) {
      status
      statusName
    }
  }
`;
export const ACCEPT_TASK_QUERY = `
  mutation ACCEPTTASK($input: TaskOperationInput!) {
    assignTask(input: $input) {
      status
      statusName
    }
  }
`;
export const VIEW_TASK_QUERY = gql`
  query VIEWTASK($taskId: ID!) {
    getTask(taskId: $taskId) {
      taskId
      taskGroupId
      categoryId
      createdDate {
        formatString(format: "dd-MMM-yyyy")
      }
      subCategoryId
      subSubCategoryId
      title
      resolution
      currentAssignee
      createdBy
      resolvedBy
      statusName
      currentAssigneeName
      createdByName
      resolvedDate {
        formatString(format: "dd-MMM-yyyy")
      }
      dueDate {
        formatString(format: "dd-MMM-yyyy")
      }
      status
      description
      creationLocLatitude
      creationLocLongitude
    }
  }
`;

export const GETCATEGORY_QUERY = gql`
  query GETCATEGORY($categoryId: ID!) {
    getCategory(categoryId: $categoryId) {
      categoryId
      name
    }
  }
`;

export const EDIT_TASK_SUBMIT_QUERY = `
     mutation EDIT($input: EditTaskInput!) {
    editTask(input:$input) {                 
			 taskId
      taskGroupId
      categoryId
      createdDate {
        formatString(format: "dd-MMM-yyyy")
      }
      subCategoryId
      subSubCategoryId
      title
      resolution
      currentAssignee
      createdBy
      resolvedBy
      statusName
      currentAssigneeName
      createdByName
      resolvedDate {
        formatString(format: "dd-MMM-yyyy")
      }
      dueDate {
        formatString(format: "dd-MMM-yyyy")
      }
      status
      description
      creationLocLatitude
      creationLocLongitude
		
	}
}
`;
