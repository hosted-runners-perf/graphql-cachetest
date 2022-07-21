/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { CypherEnvironment } from "../Environment";
import { convertToCypherParams } from "../utils";
import { Clause } from "./Clause";

type RawCypherCallback = (env: CypherEnvironment) => [string, Record<string, any>] | undefined;

/** For compatibility reasons, allows for a raw string to be used as a clause */
export class RawCypher extends Clause {
    private callback: RawCypherCallback;

    constructor(callback: RawCypherCallback, parent?: Clause) {
        super(parent);
        this.callback = callback;
    }

    public getCypher(env: CypherEnvironment): string {
        const cbResult = this.callback(env);
        if (!cbResult) return "";
        const [query, params] = cbResult;

        const cypherParams = convertToCypherParams(params);

        Object.entries(cypherParams).forEach(([key, param]) => {
            env.addNamedParamReference(key, param);
        });
        return query;
    }
}