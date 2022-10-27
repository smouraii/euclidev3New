import React, { useState } from "react";
import { Modal, Button, Icon, List, Skeleton } from "antd";

export default function ModalAttachementList(props) {

  const [attachments, setAttachments] = useState([]);
  const [visible, setVisible] = useState(false);

  React.useEffect(() => {
    setAttachments(props.attachments);
  }, [props.attachments]);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
  };

  return (
    <>
      {attachments && attachments.length > 1 &&
          <Button type="ghost" onClick={showModal}>
            <Icon type="file" />
          </Button>
      }
      { attachments && attachments.length == 1 &&
          <Button
            type="ghost"
            onClick={() =>
              (window.location.href = `${process.env.REACT_APP_HOST}/EuclideV2/api/getAttachment?attachment=${attachments[0].id}`)
            }
          >
            <Icon type="file" />
          </Button>
      }
      { attachments && attachments.length == 0 &&
          <Button type="ghost" disabled={true}>
            <Icon type="file" />
          </Button>
      }
      <Modal
        visible={visible}
        title="Attachement"
        onOk={handleOk}
        footer={[
          <Button key="back" type="primary" onClick={handleOk}>
            Return
          </Button>,
        ]}
      >
        <div className="inputContainer">
          <List
            className="demo-loadmore-list"
            itemLayout="horizontal"
            dataSource={attachments}
            renderItem={(attachment) =>
              <List.Item
                actions={[
                  <a
                    target="blank"
                    href={`${process.env.REACT_APP_HOST}/EuclideV2/api/getAttachment?attachment=${attachment.id}`}
                  >
                    {attachment.attachmentdesc}
                  </a>,
                ]}
              ></List.Item>
            }
          />
        </div>
      </Modal>
    </>
  );
}
