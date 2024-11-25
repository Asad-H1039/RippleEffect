import dspy

from chatbot.agents.action import Action, ActionInput, possible_actions


def select_action(user_input):
    print('user input: ', user_input)
    doc_query_pair = ActionInput(
        user_input=user_input, possible_actions=list(possible_actions.keys())
    )
    # print('doc_query_pair: ', doc_query_pair)
    # predictor = dspy.TypedChainOfThought(Action)
    # print('predictor: ', predictor)
    # prediction = predictor(input=doc_query_pair)
    # print('prediction: ', prediction)
    # action_to_take = prediction.action_to_take
    
    # # Check if there are multiple actions and split, otherwise return as list
    # if ', ' in action_to_take:
    #     actions = action_to_take.split(', ')
    # else:
    #     actions = [action_to_take]
    
    # print('actions:', actions)
    
    # return actions
    print('doc_query_pair: ', doc_query_pair)
    predictor = dspy.TypedChainOfThought(Action)
    print('predictor: ', predictor)
    prediction = predictor(input=doc_query_pair)
    print('prediction: ', prediction)
    return prediction.action_to_take



def get_bot_response(user_message):
    action = select_action(user_message)
    print('actions: ', action)

    try:
        # action = actions[0]
        # print('action: ', action)
        # if action in possible_actions:
        #     return possible_actions[action](user_message)
        # else:
        #     return "Unrecognized action, question must be more precise"
        if action in possible_actions:
            return possible_actions[action](user_message)
        else:
            # return "Unrecognized action, question must be more precise"
            return "Please rephrase your question."
    except Exception as e:
        return f"An error occurred: {str(e)}"
