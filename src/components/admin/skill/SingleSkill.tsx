"use client";
import Modal from "@/components/Modal";
import {
  Skill,
  DeleteSkillDocument,
  DeleteSkillMutation,
  DeleteSkillMutationVariables,
  GetOneSkillDocument,
  GetOneSkillQuery,
  GetOneSkillQueryVariables,
} from "@/gql/graphql";
import {  useState } from "react";
import { OperationResult, useMutation, useQuery } from "urql";
import EditSkill from "./EditSkill";
import CreateSkill from "./CreateSkill";
import { DeleteIcon, EditIcon } from "@/icons/action";

interface Props {
  id: number;
  name: string;
  isCreate: boolean;
  setIsCreate: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  data: Skill[];
  setData: React.Dispatch<React.SetStateAction<Skill[]>>;
  isOpen : boolean;
  setIsOpen : React.Dispatch<React.SetStateAction<boolean>>;
}

const OneSkill = (props: Props) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [{ fetching, data }] = useQuery<
    GetOneSkillQuery,
    GetOneSkillQueryVariables
  >({
    query: GetOneSkillDocument,
    variables: {
      id: props.id,
    },
    pause: props.isCreate || props.isEdit,
  });

  const [state, DeleteSkillExecute] = useMutation(DeleteSkillDocument);


  const HandleDelete =async ()=>{
    
    const deletedData : OperationResult<DeleteSkillMutation,DeleteSkillMutationVariables> = await DeleteSkillExecute({
      id: props.id
    });
    
    if(deletedData.data?.removeSkill?.__typename){
      const deleted = props.data.filter((value , index)=>{
        return value.id !== props.id;
      })

      props.setData(deleted)
      props.setIsOpen(false)
    }
    setModalOpen(false)
}

  const Skill = data?.skill;

  return (
    <div className="w-full h-full">
    {props.isEdit ? (
      <EditSkill
      descriotion={Skill?.description as string}
      shortName={Skill?.shortName as string}
        key={1}
        setIsEdit={props.setIsEdit}
        isEdit={props.isEdit}
        name={Skill?.name as string}
        id={Skill?.id as number}
        data={props.data}
        setData={props.setData}
      />
    ) : props.isCreate ? (
      <CreateSkill key={2} data={props.data} setData={props.setData} />
    ) : (
      <div className="w-full h-full">
        {fetching ? (
          <p> loading... </p>
        ) : (
          <div className="w-full h-full flex flex-col justify-between">
            <div className="relative top-15 flex flex-col items-center justify-center gap-4">
              

              <div  className="flex flex-col gap-2 w-full">
              <p className="text-xl items-center justify-center text-center" >Name</p>
              <span className="border border-gray-500 rounded-lg px-20 py-3  bg-slate-200 w-full">{Skill?.name}</span>
              </div>
             
              <div  className="flex flex-col gap-2 w-full">
              <p className="text-xl items-center justify-center text-center" >Short Name</p>
              <span className="border border-gray-500 rounded-lg px-20 py-3  bg-slate-200 w-full">{Skill?.shortName}</span>
              </div>
              <div  className="flex flex-col gap-2 w-full">
              <p className="text-xl items-center justify-center text-center" >Description</p>
              <span className="border border-gray-500 rounded-lg px-20 py-3  bg-slate-200 w-full">{Skill?.description}</span>
              </div>
            </div>
            <div className="w-full mt-4 flex items-center justify-between">
            <div
          className="w-1/2 flex items-center justify-center tooltip"
          data-tip="Back"
        ></div>
              <div className="w-1/2 flex items-center justify-around">
                <button
                  className=" border-2 text-white px-3 py-2 border-secondary rounded-xl font-bold"
                  onClick={() => {
                    props.setIsEdit(true);
                    props.setIsCreate(false);
                  }}
                >
                  <EditIcon className="w-6 h-6 cursor-pointer fill-secondary  transition-all" />
                </button>
                <button
                  className=" border-2 text-white px-3 py-2 border-secondary rounded-xl font-bold"
                  onClick={() => setModalOpen(true)}
                >
                  <DeleteIcon className="w-6 h-6 cursor-pointer fill-secondary  transition-all" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )}

    <Modal modalOpen={modalOpen} setModalOpen={setModalOpen} key={3}>
      <p>Are you sure Do you want to Delete ?</p>
      <button className="bg-red-600" onClick={HandleDelete}>
        Delete
      </button>
      <button className="bg-blue-500" onClick={() => setModalOpen(false)}>
        Cancel
      </button>
    </Modal>
  </div>
  );
};

export default OneSkill;
