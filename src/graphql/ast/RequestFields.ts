import * as graphqlFields from 'graphql-fields';

import { GraphQLResolveInfo } from 'graphql';

import { RequestFieldsOp } from './../../interfaces/RequesteFieldsOp';

export class RequestedFields {
    getFields(info: GraphQLResolveInfo, options?: RequestFieldsOp | any): Array<string> {
        let fields = Object.keys(graphqlFields(info));

        fields = options.keep ? [...fields, ...options.keep] : fields;
        return options.exclude ? [...fields, ...options.exclude] : fields;
    }
}