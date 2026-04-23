import { useReducer, useCallback } from 'react';

function reducer(state, action) {
  return {
    ...state,
    [action.name]: action.value,
  };
}

export default function useInputs(initialForm) {
  const [state, dispatch] = useReducer(reducer, initialForm);

  const onChange = useCallback((e) => {
    const { name, value } = e.target;
    dispatch({ name, value });
  }, []);

  const reset = useCallback(() => dispatch(initialForm), [initialForm]);

  return [state, onChange, reset];
}
