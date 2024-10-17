import dspy

from chatbot.agents.action import Action, ActionInput, possible_actions


def select_action(user_input):
    print('user input: ', user_input)
    doc_query_pair = ActionInput(
        user_input=user_input, possible_actions=list(possible_actions.keys())
    )
    print('doc_query_pair: ', doc_query_pair)
    predictor = dspy.TypedChainOfThought(Action)
    print('predictor: ', predictor)
    prediction = predictor(input=doc_query_pair)
    print('prediction: ', prediction)
    return prediction.action_to_take


def get_bot_response(user_message):
    action = select_action(user_message)
    print('action: ', action)

    try:
        if action in possible_actions:
            return possible_actions[action](user_message)
        else:
            return "Unrecognized action, question must be more precise"
    except Exception as e:
        return f"An error occurred: {str(e)}"
