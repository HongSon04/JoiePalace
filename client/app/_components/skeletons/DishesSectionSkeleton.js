import { Skeleton } from "@nextui-org/react";
import { Col, Row } from "antd";

const count = 10;

function DishesSectionSkeleton() {
  return (
    <Row gutter={[16, 16]} className="mt-5">
      {Array(count)
        .fill()
        .map((_, i) => (
          <Col
            key={i}
            span={8}
            md={{
              span: 6,
            }}
          >
            <div className="flex bg-whiteAlpha-100 rounded-lg items-center p-3 gap-3">
              <Skeleton className="rounded-full">
                <div className="h-[60px] aspect-square rounded-full bg-default-600/30"></div>
              </Skeleton>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between gap-5 flex-1">
                  <Skeleton className="w-20 rounded-md">
                    <div className="h-3 bg-default-600/30"></div>
                  </Skeleton>
                  <Skeleton className="w-10 rounded-md">
                    <div className="h-3 bg-default-600/30"></div>
                  </Skeleton>
                </div>
                <Skeleton className="w-20 mt-5 rounded-md">
                  <div className="h-3 bg-default-600/30"></div>
                </Skeleton>
              </div>
            </div>
          </Col>
        ))}
    </Row>
  );
}

export default DishesSectionSkeleton;
