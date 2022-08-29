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
  query GET_SUB_CATEGORY($categoryId: Int!) {
    getSubCategoriesByCategoryId(categoryId: $categoryId) {
      subCategoryId
      name
    }
  }
`;

export const CREATE_TASK_MUTATE = gql`
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
