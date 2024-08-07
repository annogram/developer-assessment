import { FC, useEffect, useState } from "react";
import { Row, Col, InputGroup, Form, Button } from "react-bootstrap";
import { Todo } from "../types/entry";
import { useDebouncedCallback } from "use-debounce";

export interface EntryListProps {
  items: Todo[];
  onDescriptionUpdated: (item: Todo, description: string) => void;
  onCheckItemChanged: (item: Todo, completed: boolean) => void;
  onDeleteItem: (id: string) => void;
}

export const EntryList: FC<EntryListProps> = ({
  items,
  onDescriptionUpdated,
  onCheckItemChanged,
  onDeleteItem
}) => {
  
  const [descriptions, setDescriptions] = useState<Record<string, [string, boolean]>>(items.reduce((acc, item) => {
    acc[item.id] = [item.description, false];
    return acc;
  }, {} as Record<string, [string, boolean]>));

  const debouncedDescriptionUpdate = useDebouncedCallback((item: Todo) => {  
    onDescriptionUpdated(item, descriptions[item.id][0]);
  }, 1500);


  const handleLiveDescriptionUpdated = (item: Todo, description: string) => {
    if(item.isCompleted) return;
    setDescriptions((prevDescriptions) => ({
      ...prevDescriptions,
      [item.id]: [description, true]
    }));

    debouncedDescriptionUpdate(item);
  }

  // for initial render to allow for live updating
  useEffect(() => {
    setDescriptions(items.reduce((acc, item) => {
      acc[item.id] = [item.description, false];
      return acc;
    }, {} as Record<string, [string, boolean]>));
  }, [items, setDescriptions]);

  return <>
    <Row className="b-0 rounded-0">
      <Col xs={12} className="justify-content-center">
        <h1>Showing {items.length} Item(s)</h1>
      </Col>
    </Row>

    {Object.entries(descriptions).map(([id, description]) => {
      const item = items.find(item => item.id === id);
      if (!item) return null;
      return (
        <Row key={id}>
          <Col>
            <InputGroup className="b-0 rounded-0" aria-label="Todo Item">
              <InputGroup.Checkbox 
                id={id} 
                checked={item.isCompleted} 
                onChange={() => {onCheckItemChanged(item, !item.isCompleted)}}
              />
              <Form.Control 
                id={id}
                disabled={item.isCompleted}
                value={description[0]} 
                className={description[1] ? 'bg-light' : ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLiveDescriptionUpdated(item, e.target.value)} 
              />
              <Button variant="danger" onClick={() => onDeleteItem(id)}>x</Button>
            </InputGroup>
          </Col>
        </Row>
      );
    })}
  </>
}