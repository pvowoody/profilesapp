import { a, defineData } from '@aws-amplify/backend';
import { postConfirmation } from '../auth/post-confirmation/resource';

export const data = defineData({
  schema: a.schema({
    UserProfile: a
      .model({
        id: a.id().required(),
        profileOwner: a.string().required(),
        name: a.string(),
        email: a.string(),
      })
      .authorization((allow) => [
        // Each user can only access their own profile
        allow.ownerDefinedIn('profileOwner'),
      ]),
  }),
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    // Our Lambda function will talk to this data model using IAM
    functionAuthorizationMode: 'iam',
  },
  functionAccess: (allow) => [
    // Give the post-confirmation Lambda permission to write profiles
    allow.resource(postConfirmation).to(['create']),
  ],
});
