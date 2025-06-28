import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const MessageFieldSchema = z.object({
  name: z.string(),
  type: z.string().describe('Field type (e.g., string, number, Date, UUID, etc.)'),
  required: z.boolean().default(true),
  description: z.string().optional(),
  defaultValue: z.any().optional().describe('Default value for optional fields')
}).describe('Field definition for a message');

const BaseMessageSchema = z.object({
  name: z.string().describe('Message name (e.g., CustomerRegistered, RegisterCustomer)'),
  fields: z.array(MessageFieldSchema),
  description: z.string().optional(),
  metadata: z.object({
    version: z.number().default(1).describe('Version number for schema evolution')
  }).optional()
});

const CommandSchema = BaseMessageSchema.extend({
  type: z.literal('command'),
}).describe('Command that triggers state changes');

const EventSchema = BaseMessageSchema.extend({
  type: z.literal('event'),
  source: z.enum(['internal', 'external']).default('internal')
}).describe('Event representing something that has happened');

const StateSchema = BaseMessageSchema.extend({
  type: z.literal('state'),
}).describe('State/Read Model representing a view of data');

const GivenWhenThenSchema = z.object({
  given: z.array(z.object({
    eventName: z.string(),
    exampleData: z.record(z.any()).optional()
  })).optional().describe('Pre-existing events (state)'),
  when: z.object({
    type: z.enum(['command']),
    name: z.string(),
    exampleData: z.record(z.any()).optional()
  }).describe('Triggering action'),
  then: z.array(z.object({
    type: z.enum(['event', 'state']),
    name: z.string(),
    exampleData: z.record(z.any()).optional()
  })).describe('Expected outcome')
}).describe('Business rule in Given/When/Then format');

const BaseSliceSchema = z.object({
  name: z.string().describe('Business-friendly name'),
  context: z.string().optional().describe('Additional business context'),
  businessRules: z.array(GivenWhenThenSchema).optional()
});

const StateChangeSchema = BaseSliceSchema.extend({
  type: z.literal('stateChange'),
  trigger: z.object({
    source: z.enum(['ui', 'api', 'automation']),
    description: z.string().optional()
  }),
  stream: z.string().describe('Stream that this state change will write to'),
  command: z.string().describe('Command name that triggers this state change'),
  events: z.array(z.string()).describe('Events produced by this state change'),
  invariants: z.array(z.string()).optional().describe('Business invariants to maintain')
}).describe('Pattern for changing system state (Command → Event)');

const StateViewSchema = BaseSliceSchema.extend({
  type: z.literal('stateView'),
  trigger: z.object({
    source: z.enum(['ui', 'api', 'automation']),
    description: z.string().optional()
  }),
  events: z.array(z.string()).describe('Events that update this view'),
}).describe('Pattern for reading data (Event → State)');

const AutomationSchema = BaseSliceSchema.extend({
  type: z.literal('automation'),
  trigger: z.object({
    type: z.enum(['event', 'timer', 'schedule']),
    events: z.array(z.string()).optional().describe('Events that build the TODO list'),
    schedule: z.string().optional().describe('Cron expression or interval')
  }),
  commands: z.array(z.string()).describe('Commands triggered by this automation'),
}).describe('Pattern for automated processes (Event → Command)');

const TranslationSchema = BaseSliceSchema.extend({
  type: z.literal('translation'),
  source: z.string().describe('External system name'),
  externalEvent: z.string().describe('External event name'),
  internalEvents: z.array(z.string()).describe('Internal events produced')
}).describe('Pattern for external system integration (External Event → Internal Event)');

const SliceSchema = z.discriminatedUnion('type', [
  StateChangeSchema,
  StateViewSchema,
  AutomationSchema,
  TranslationSchema
]);

const EventModelSchema = z.object({
  name: z.string(),
  version: z.string().default('1.0.0'),
  description: z.string().optional(),
  slices: z.array(SliceSchema),
  metadata: z.object({
    authors: z.array(z.string()).optional(),
  }).optional()
}).describe('Complete Event Model for a system');

export type MessageField = z.infer<typeof MessageFieldSchema>;
export type Command = z.infer<typeof CommandSchema>;
export type Event = z.infer<typeof EventSchema>;
export type State = z.infer<typeof StateSchema>;
export type GivenWhenThen = z.infer<typeof GivenWhenThenSchema>;
export type StateChange = z.infer<typeof StateChangeSchema>;
export type StateView = z.infer<typeof StateViewSchema>;
export type Automation = z.infer<typeof AutomationSchema>;
export type Translation = z.infer<typeof TranslationSchema>;
export type Slice = z.infer<typeof SliceSchema>;
export type EventModel = z.infer<typeof EventModelSchema>;

export { EventModelSchema };

if (require.main === module) {
  const schemas = Object.fromEntries(
    Object.entries({
      messageField: MessageFieldSchema,
      baseMessage: BaseMessageSchema,
      command: CommandSchema,
      event: EventSchema,
      state: StateSchema,
      givenWhenThen: GivenWhenThenSchema,
      baseSlice: BaseSliceSchema,
      stateChange: StateChangeSchema,
      stateView: StateViewSchema,
      automation: AutomationSchema,
      translation: TranslationSchema,
      slice: SliceSchema,
      eventModel: EventModelSchema
    }).map(([k, v]) => [
      k,
      zodToJsonSchema(v, {
        $refStrategy: 'root' as const,
        target: 'jsonSchema7' as const,
        definitionPath: 'definitions',
        name: k[0].toUpperCase() + k.slice(1)
      })
    ])
  );
  console.log(JSON.stringify(schemas, null, 2));
}